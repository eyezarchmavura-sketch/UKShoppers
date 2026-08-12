import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { validHmacSha512 } from "./paymentWebhooks";

describe("payment webhook signature verification", () => {
  const rawBody = Buffer.from('{"event":"charge.success","data":{"reference":"UKSA-TEST"}}');
  const secret = "unit-test-webhook-secret";
  const validSignature = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

  it("accepts only the expected HMAC-SHA512 signature for the exact raw payload", () => {
    expect(validHmacSha512(rawBody, validSignature, secret)).toBe(true);
    expect(validHmacSha512(Buffer.from("{}"), validSignature, secret)).toBe(false);
  });

  it("rejects missing, malformed, or mismatched webhook signatures", () => {
    expect(validHmacSha512(rawBody, undefined, secret)).toBe(false);
    expect(validHmacSha512(rawBody, "wrong-signature", secret)).toBe(false);
    expect(validHmacSha512(rawBody, validSignature, undefined)).toBe(false);
  });
});
