import crypto from "node:crypto";
import type { Express, Request, Response } from "express";
import {
  getPaymentByRef,
  recordVerifiedPaymentEvent,
  settleVerifiedPayment,
} from "./db";

type VerifiedGatewayPayment = {
  ref: string;
  transactionId: string;
  amountMinor?: number;
  amountMajor?: number;
  currency: string;
};

const json = (res: Response, status: number, body: Record<string, unknown>) => res.status(status).json(body);

function exactSecretMatch(received: string | undefined, expected: string): boolean {
  if (!received || !expected) return false;
  const a = Buffer.from(received, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function validHmacSha512(rawBody: Buffer, signature: string | undefined, secret: string | undefined): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return exactSecretMatch(signature, expected);
}

function parseExpectedAmount(amount: string): number | undefined {
  const match = amount.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  const parsed = match ? Number(match[0]) : Number.NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

async function verifyPaystack(reference: string): Promise<VerifiedGatewayPayment | undefined> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return undefined;
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { status?: boolean; data?: Record<string, unknown> };
  const data = body.data ?? {};
  if (body.status !== true || data.status !== "success") return undefined;
  return {
    ref: String(data.reference ?? ""),
    transactionId: String(data.id ?? ""),
    amountMinor: Number(data.amount),
    currency: String(data.currency ?? ""),
  };
}

async function verifyFlutterwave(transactionId: string): Promise<VerifiedGatewayPayment | undefined> {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) return undefined;
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { status?: string; data?: Record<string, unknown> };
  const data = body.data ?? {};
  if (body.status !== "success" || data.status !== "successful") return undefined;
  return {
    ref: String(data.tx_ref ?? ""),
    transactionId: String(data.id ?? transactionId),
    amountMajor: Number(data.amount),
    currency: String(data.currency ?? ""),
  };
}

async function acceptVerifiedPayment(input: {
  provider: "paystack" | "flutterwave";
  eventId: string;
  eventType: string;
  rawPayload: string;
  verified: VerifiedGatewayPayment;
}): Promise<"accepted" | "duplicate" | "invalid"> {
  if (!input.verified.ref || !input.verified.transactionId) return "invalid";
  const expected = await getPaymentByRef(input.verified.ref);
  if (!expected || expected.gateway.toLowerCase() !== input.provider) return "invalid";
  const expectedAmount = parseExpectedAmount(expected.amount);
  const expectedCurrency = expected.currencyCode.toUpperCase();
  const amountMatches =
    expectedAmount !== undefined &&
    ((input.verified.amountMinor !== undefined && Math.round(expectedAmount * 100) === Math.round(input.verified.amountMinor)) ||
      (input.verified.amountMajor !== undefined && Math.abs(expectedAmount - input.verified.amountMajor) < 0.0001));
  if (!amountMatches || input.verified.currency.toUpperCase() !== expectedCurrency) return "invalid";

  const recorded = await recordVerifiedPaymentEvent({
    paymentId: expected.id,
    provider: input.provider,
    providerEventId: input.eventId,
    eventType: input.eventType,
    verificationStatus: "verified",
    payload: input.rawPayload.slice(0, 60000),
  });
  if (!recorded) return "duplicate";
  const settlement = await settleVerifiedPayment({
    ref: expected.ref,
    provider: input.provider,
    providerTransactionId: input.verified.transactionId,
  });
  return settlement === "settled" || settlement === "already_settled" ? "accepted" : "invalid";
}

async function paystackWebhook(req: Request, res: Response) {
  const raw = req.body as Buffer;
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(res, 503, { error: "Paystack webhook is not configured" });
  if (!Buffer.isBuffer(raw) || !validHmacSha512(raw, req.header("x-paystack-signature") ?? undefined, secret)) {
    return json(res, 401, { error: "Invalid Paystack signature" });
  }
  const event = JSON.parse(raw.toString("utf8")) as { event?: string; data?: Record<string, unknown> };
  if (event.event !== "charge.success") return res.status(200).send("ignored");
  const reference = String(event.data?.reference ?? "");
  const verified = await verifyPaystack(reference);
  if (!verified) return json(res, 400, { error: "Paystack transaction verification failed" });
  const outcome = await acceptVerifiedPayment({
    provider: "paystack",
    eventId: `paystack:${String(event.data?.id ?? reference)}`,
    eventType: event.event,
    rawPayload: raw.toString("utf8"),
    verified,
  });
  return outcome === "invalid" ? json(res, 400, { error: "Payment did not match expected intent" }) : res.status(200).send(outcome);
}

async function flutterwaveWebhook(req: Request, res: Response) {
  const raw = req.body as Buffer;
  const signature = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  if (!signature) return json(res, 503, { error: "Flutterwave webhook is not configured" });
  if (!Buffer.isBuffer(raw) || !exactSecretMatch(req.header("verif-hash") ?? undefined, signature)) {
    return json(res, 401, { error: "Invalid Flutterwave signature" });
  }
  const event = JSON.parse(raw.toString("utf8")) as { event?: string; data?: Record<string, unknown> };
  if (event.event !== "charge.completed" || event.data?.status !== "successful") return res.status(200).send("ignored");
  const verified = await verifyFlutterwave(String(event.data?.id ?? ""));
  if (!verified) return json(res, 400, { error: "Flutterwave transaction verification failed" });
  const outcome = await acceptVerifiedPayment({
    provider: "flutterwave",
    eventId: `flutterwave:${String(event.data?.id ?? verified.transactionId)}`,
    eventType: event.event,
    rawPayload: raw.toString("utf8"),
    verified,
  });
  return outcome === "invalid" ? json(res, 400, { error: "Payment did not match expected intent" }) : res.status(200).send(outcome);
}

function disabledMobileMoneyWebhook(provider: string) {
  return (_req: Request, res: Response) =>
    json(res, 503, {
      error: `${provider} callback adapter is disabled until its production callback contract and reconciliation credentials are configured`,
    });
}

/** Must be registered before express.json() so HMAC verification receives exact raw bytes. */
export function registerPaymentWebhookRoutes(app: Express) {
  app.post("/api/payments/webhooks/paystack", (req, res, next) => {
    expressRawJson(req, res, next);
  }, paystackWebhook);
  app.post("/api/payments/webhooks/flutterwave", (req, res, next) => {
    expressRawJson(req, res, next);
  }, flutterwaveWebhook);
  app.post("/api/payments/webhooks/safaricom-ke", disabledMobileMoneyWebhook("Safaricom Kenya"));
  app.post("/api/payments/webhooks/vodacom-tz", disabledMobileMoneyWebhook("Vodacom Tanzania"));
}

// Kept local to ensure every signed route uses the same strict raw-body parser.
function expressRawJson(req: Request, res: Response, next: (error?: unknown) => void) {
  const chunks: Buffer[] = [];
  req.on("data", chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
  req.on("end", () => {
    req.body = Buffer.concat(chunks);
    next();
  });
  req.on("error", next);
}
