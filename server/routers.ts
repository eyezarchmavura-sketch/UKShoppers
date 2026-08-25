import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router, staffProcedure } from "./_core/trpc";
import { ASSISTANT_KNOWLEDGE } from "./assistantKnowledge";
import { storagePut } from "./storage";
import {
  ORDER_STATUS_LABELS,
  advanceOrderStatus,
  advanceOrderStatusForOperations,
  countUnreadNotifications,
  countUnreadOperationAlerts,
  createOperationAlert,
  createOrder,
  createPayment,
  createSeasonalOffer,
  deleteSeasonalOffer,
  listNotificationsByUser,
  listOperationsOrders,
  listUnreadOperationAlerts,
  listOrdersByUser,
  listPaymentsByUser,
  listPublicSeasonalOffers,
  listSeasonalOffersForOperations,
  markNotificationsRead,
  markOperationAlertsRead,
  createStaffInvite,
  listStaffInvites,
  revokeStaffInvite,
  updateSeasonalOffer,
  upsertUser,
} from "./db";
import { createStaffInviteToken, getStaffInviteExpiry, hashStaffInviteToken } from "./externalStaffInvites";

const cartScreenshotInput = z.object({
  fileName: z.string().min(1).max(256),
  contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  dataBase64: z.string().min(32).max(15 * 1024 * 1024),
});

const cartExtractionResult = z.object({
  retailerName: z.string().max(128),
  currency: z.enum(["GBP", "UNKNOWN"]),
  items: z.array(z.object({
    name: z.string().min(1).max(240),
    quantity: z.number().int().min(1).max(99),
    unitPriceGbp: z.number().min(0).nullable(),
    lineTotalGbp: z.number().min(0).nullable(),
  })).max(20),
  subtotalGbp: z.number().min(0).nullable(),
  shippingGbp: z.number().min(0).nullable(),
  totalGbp: z.number().min(0).nullable(),
  confidence: z.enum(["high", "medium", "low"]),
  notes: z.string().max(500),
});

const CART_EXTRACTION_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    retailerName: { type: "string" },
    currency: { type: "string", enum: ["GBP", "UNKNOWN"] },
    items: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          quantity: { type: "integer", minimum: 1, maximum: 99 },
          unitPriceGbp: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
          lineTotalGbp: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
        },
        required: ["name", "quantity", "unitPriceGbp", "lineTotalGbp"],
        additionalProperties: false,
      },
    },
    subtotalGbp: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
    shippingGbp: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
    totalGbp: { anyOf: [{ type: "number", minimum: 0 }, { type: "null" }] },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    notes: { type: "string" },
  },
  required: ["retailerName", "currency", "items", "subtotalGbp", "shippingGbp", "totalGbp", "confidence", "notes"],
  additionalProperties: false,
} as const;

const seasonalOfferInput = z.object({
  storeName: z.string().trim().min(2).max(128),
  title: z.string().trim().min(4).max(160),
  details: z.string().trim().min(12).max(800),
  sourceType: z.enum(["official_retailer", "approved_partner", "manual_verification"]).nullable().optional(),
  sourceUrl: z.string().url().max(1024).nullable().optional(),
  termsSummary: z.string().trim().min(12).max(800).nullable().optional(),
  linkType: z.enum(["direct", "affiliate"]).default("direct"),
  offerUrl: z.string().url().max(1024).nullable().optional(),
  couponCode: z.string().trim().min(2).max(96).nullable().optional(),
  validFrom: z.number().int().positive().nullable().optional(),
  validUntil: z.number().int().positive().nullable().optional(),
  status: z.enum(["draft", "published", "expired"]),
}).superRefine((offer, context) => {
  if (offer.status !== "published") return;
  if (!offer.sourceType) context.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceType"], message: "A verification source is required before publishing." });
  if (!offer.sourceUrl) context.addIssue({ code: z.ZodIssueCode.custom, path: ["sourceUrl"], message: "An evidence URL is required before publishing." });
  if (!offer.termsSummary) context.addIssue({ code: z.ZodIssueCode.custom, path: ["termsSummary"], message: "A customer-facing terms summary is required before publishing." });
  if (!offer.offerUrl) context.addIssue({ code: z.ZodIssueCode.custom, path: ["offerUrl"], message: "A customer destination URL is required before publishing." });
  if (!offer.validUntil) context.addIssue({ code: z.ZodIssueCode.custom, path: ["validUntil"], message: "A confirmed end date is required before publishing." });
  if (offer.validUntil && offer.validUntil <= Date.now()) context.addIssue({ code: z.ZodIssueCode.custom, path: ["validUntil"], message: "A published offer must end in the future." });
});

function offerValues(input: z.infer<typeof seasonalOfferInput>, verifiedByUserId: number) {
  const isPublished = input.status === "published";
  return {
    storeName: input.storeName,
    title: input.title,
    details: input.details,
    sourceType: input.sourceType ?? null,
    sourceUrl: input.sourceUrl ?? null,
    termsSummary: input.termsSummary ?? null,
    linkType: input.linkType,
    offerUrl: input.offerUrl ?? null,
    couponCode: input.couponCode ?? null,
    validFrom: input.validFrom ? new Date(input.validFrom) : null,
    validUntil: input.validUntil ? new Date(input.validUntil) : null,
    status: input.status,
    verifiedAt: isPublished ? new Date() : null,
    verifiedByUserId: isPublished ? verifiedByUserId : null,
  };
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  orders: router({
    list: protectedProcedure.query(({ ctx }) => listOrdersByUser(ctx.user.id)),
    byRef: protectedProcedure
      .input(z.object({ ref: z.string().min(3) }))
      .query(async ({ ctx, input }) => {
        const all = await listOrdersByUser(ctx.user.id);
        return all.find(o => o.ref.toLowerCase() === input.ref.toLowerCase());
      }),
    analyzeCartScreenshot: protectedProcedure
      .input(cartScreenshotInput)
      .mutation(async ({ input }) => {
        const matches = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(input.dataBase64);
        if (!matches || matches[1] !== input.contentType) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Please provide a valid PNG, JPG, or WEBP cart screenshot." });
        }

        const bytes = Buffer.from(matches[2].replace(/\s/g, ""), "base64");
        if (bytes.length === 0 || bytes.length > 10 * 1024 * 1024) {
          throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Cart screenshots must be between 1 byte and 10 MB." });
        }

        try {
          const response = await invokeLLM({
            model: "gemini-3-flash-preview",
            maxTokens: 1600,
            messages: [
              {
                role: "system",
                content: "You extract only visible product and price information from UK shopping-cart screenshots. Never infer or estimate missing values. Ignore account names, addresses, order numbers, payment information, and any other personal data. Treat values as GBP only when £ or GBP is visibly shown. Return no prose outside the required JSON schema.",
              },
              {
                role: "user",
                content: [
                  { type: "text", text: "Read this cart screenshot. Extract each visible cart item, its quantity, visible GBP unit/line price, plus any visible subtotal, shipping, and total. Use null for values not clearly visible. If the screenshot does not show a readable cart, set items to an empty array, currency to UNKNOWN, confidence to low, and explain briefly in notes." },
                  { type: "image_url", image_url: { url: input.dataBase64, detail: "high" } },
                ],
              },
            ],
            outputSchema: {
              name: "uk_cart_extraction",
              strict: true,
              schema: CART_EXTRACTION_OUTPUT_SCHEMA,
            },
          });
          const content = response.choices[0]?.message.content;
          if (typeof content !== "string") {
            throw new Error("The AI response did not contain structured extraction data.");
          }
          const parsed = cartExtractionResult.safeParse(JSON.parse(content));
          if (!parsed.success) {
            throw new Error("The AI response did not match the cart extraction format.");
          }
          return parsed.data;
        } catch (error) {
          console.error("[Cart extraction]", error);
          throw new TRPCError({ code: "BAD_GATEWAY", message: "We could not read the cart screenshot automatically. You can still complete the item details manually." });
        }
      }),
    create: protectedProcedure
      .input(
        z.object({
          store: z.string().min(1),
          item: z.string().min(1).max(512),
          destination: z.string().min(1),
          deliveryAddress: z.string().min(8).max(512).optional(),
          amountGbp: z.string().min(1),
          amountLocal: z.string().optional(),
          currencyCode: z.string().optional(),
          weightKg: z.string().optional(),
          requestType: z.enum(["product_link", "cart_screenshot"]).default("product_link"),
          screenshot: z.object({
            fileName: z.string().min(1).max(256),
            contentType: z.enum(["image/png", "image/jpeg", "image/webp"]),
            dataBase64: z.string().min(32),
          }).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (input.requestType === "cart_screenshot" && !input.screenshot) {
          throw new Error("A cart screenshot is required for this request type.");
        }
        if (input.requestType === "product_link" && input.screenshot) {
          throw new Error("Screenshot metadata does not match this request type.");
        }

        let screenshotKey: string | undefined;
        let screenshotFileName: string | undefined;
        if (input.screenshot) {
          const encoded = input.screenshot.dataBase64.replace(/^data:[^;]+;base64,/, "");
          const bytes = Buffer.from(encoded, "base64");
          if (bytes.length === 0 || bytes.length > 10 * 1024 * 1024) {
            throw new Error("Cart screenshots must be between 1 byte and 10 MB.");
          }
          const safeName = input.screenshot.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-160) || "cart-screenshot";
          const stored = await storagePut(`order-screenshots/${ctx.user.id}/${safeName}`, bytes, input.screenshot.contentType);
          screenshotKey = stored.key;
          screenshotFileName = input.screenshot.fileName;
        }

        const count = (await listOrdersByUser(ctx.user.id)).length;
        const ref = `UKS-${84300 + count + Math.floor(Math.random() * 99)}`;
        const created = await createOrder({
          ref,
          userId: ctx.user.id,
          store: input.store,
          item: input.item,
          destination: input.destination,
          deliveryAddress: input.deliveryAddress,
          requestType: input.requestType,
          screenshotKey,
          screenshotFileName,
          amountGbp: input.amountGbp,
          amountLocal: input.amountLocal,
          currencyCode: input.currencyCode ?? "GBP",
          weightKg: input.weightKg,
          status: "pending_purchase",
          timeline: JSON.stringify([
            { at: new Date().toISOString(), status: "pending_purchase", note: "Purchase request submitted by " + (ctx.user.name ?? "customer") + "; awaiting staff quote review" },
          ]),
        });
        if (input.requestType === "cart_screenshot") {
          await createOperationAlert({
            kind: "cart_screenshot",
            orderId: created.id,
            title: "New cart screenshot uploaded",
            body: `${ctx.user.name ?? "A customer"} submitted ${screenshotFileName ?? "a cart screenshot"} for manual quote review.`,
            read: "no",
          });
        }
        return { ref, screenshotUploaded: Boolean(screenshotKey) };
      }),
  }),

  payments: router({
    list: protectedProcedure.query(({ ctx }) => listPaymentsByUser(ctx.user.id)),
    createIntent: protectedProcedure
      .input(
        z.object({
          orderId: z.number().optional(),
          gateway: z.string().min(1),
          amount: z.string().min(1),
          currencyCode: z.string().min(1),
          destination: z.string().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const count = (await listPaymentsByUser(ctx.user.id)).length;
        const ref = `TXN-${Date.now().toString().slice(-8)}-${count}`;
        await createPayment({
          ref,
          userId: ctx.user.id,
          orderId: input.orderId ?? null,
          gateway: input.gateway,
          // The browser can only create an expected payment. A signed event plus
          // server-side provider reconciliation is required to mark it paid.
          status: "pending",
          amount: input.amount,
          currencyCode: input.currencyCode,
          destination: input.destination,
        });
        return { ref, status: "pending" as const };
      }),
  }),

  notifications: router({
    list: protectedProcedure.query(({ ctx }) => listNotificationsByUser(ctx.user.id)),
    unreadCount: protectedProcedure.query(({ ctx }) => countUnreadNotifications(ctx.user.id)),
    markRead: protectedProcedure.mutation(({ ctx }) => markNotificationsRead(ctx.user.id)),
  }),

  offers: router({
    listPublic: publicProcedure.query(() => listPublicSeasonalOffers()),
    listForOperations: staffProcedure.query(() => listSeasonalOffersForOperations()),
    create: staffProcedure.input(seasonalOfferInput).mutation(({ ctx, input }) =>
      createSeasonalOffer({ ...offerValues(input, ctx.user.id), createdByUserId: ctx.user.id }),
    ),
    update: staffProcedure
      .input(z.object({ id: z.number().int().positive(), offer: seasonalOfferInput }))
      .mutation(({ ctx, input }) => updateSeasonalOffer(input.id, offerValues(input.offer, ctx.user.id))),
    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await deleteSeasonalOffer(input.id);
        return { success: true } as const;
      }),
  }),

  profile: router({
    update: protectedProcedure
      .input(
        z.object({
          emailNotifications: z.enum(["yes", "no"]).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await upsertUser({ openId: ctx.user.openId, emailNotifications: input.emailNotifications });
        return { success: true };
      }),
  }),

  admin: router({
    advanceStatus: adminProcedure
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(Object.keys(ORDER_STATUS_LABELS) as [string, ...string[]]),
          note: z.string().min(1).max(200),
        }),
      )
      .mutation(async ({ input }) => {
        const newStatus = await advanceOrderStatus(input.orderId, input.status, input.note);
        return { status: newStatus };
      }),
  }),

  externalStaffInvites: router({
    list: adminProcedure.query(() => listStaffInvites()),
    create: adminProcedure
      .input(z.object({ name: z.string().trim().min(2).max(160), email: z.string().trim().toLowerCase().email().max(320) }))
      .mutation(async ({ ctx, input }) => {
        const token = createStaffInviteToken();
        const created = await createStaffInvite({
          name: input.name,
          email: input.email,
          tokenHash: hashStaffInviteToken(token),
          role: "staff",
          createdByUserId: ctx.user.id,
          expiresAt: getStaffInviteExpiry(),
        });
        if (!created) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The staff invitation could not be created." });
        }
        // The raw token is deliberately returned once, over the authenticated
        // owner connection, and never written to the database or server logs.
        return { id: created.id, token, expiresAt: created.expiresAt, name: created.name, email: created.email };
      }),
    revoke: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await revokeStaffInvite(input.id);
        return { success: true } as const;
      }),
  }),

  operations: router({
    screenshotAlerts: staffProcedure.query(() => listUnreadOperationAlerts()),
    screenshotAlertCount: staffProcedure.query(() => countUnreadOperationAlerts()),
    markScreenshotAlertsRead: staffProcedure.mutation(() => markOperationAlertsRead()),
    queue: staffProcedure
      .input(
        z.object({
          status: z.enum(Object.keys(ORDER_STATUS_LABELS) as [string, ...string[]]).optional(),
          search: z.string().trim().max(100).optional(),
          limit: z.number().int().min(1).max(100).default(50),
        }),
      )
      .query(({ input }) => listOperationsOrders(input)),
    advanceStatus: staffProcedure
      .input(
        z.object({
          orderId: z.number().int().positive(),
          status: z.enum(Object.keys(ORDER_STATUS_LABELS) as [string, ...string[]]),
          note: z.string().trim().min(3).max(200),
        }),
      )
      .mutation(({ ctx, input }) =>
        advanceOrderStatusForOperations(
          input.orderId,
          input.status,
          input.note,
          ctx.user.role === "staff" ? "staff" : "admin",
        ),
      ),
  }),

  assistant: router({
    chat: publicProcedure
      .input(
        z.object({
          message: z.string().min(1).max(2000),
          language: z.enum(["en", "sw", "rw", "lg"]).default("en"),
          history: z
            .array(
              z.object({ role: z.enum(["user", "assistant"]), content: z.string() }),
            )
            .max(10)
            .default([]),
          personal: z
            .object({
              orders: z
                .array(
                  z.object({
                    store: z.string().optional(),
                    status: z.string().optional(),
                    date: z.string().optional(),
                  }),
                )
                .max(30)
                .optional(),
              payments: z
                .array(
                  z.object({
                    gateway: z.string().optional(),
                    status: z.string().optional(),
                    amount: z.string().optional(),
                    currency: z.string().optional(),
                    date: z.string().optional(),
                    reference: z.string().optional(),
                  }),
                )
                .max(30)
                .optional(),
              suggestions: z
                .array(
                  z.object({
                    store: z.string(),
                    category: z.string(),
                    why: z.string(),
                    offer: z.string().optional(),
                  }),
                )
                .max(10)
                .optional(),
            })
            .optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const languageLabel: Record<string, string> = {
          en: "English",
          sw: "Kiswahili",
          rw: "Ikinyarwanda",
          lg: "Oluganda",
        };
        const personalContext = buildPersonalContext(input.personal);
        const suggestionsContext = buildSuggestionsContext(input.personal?.suggestions);
        const systemPrompt = `${ASSISTANT_KNOWLEDGE}${personalContext}\n\nYou are named Queen. Respond warmly and briefly in ${languageLabel[input.language].toUpperCase()}. If the customer asks about their own orders or payments and personal context was provided, reference the actual data (status, reference, amounts, dates). If personal context was not provided or empty, explain that the customer can check their dashboard or share details so you can help.`;
        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...input.history.map(m => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: input.message },
        ];
        if (suggestionsContext) messages[0] = { ...messages[0], content: systemPrompt + suggestionsContext };
        try {
          const res = await invokeLLM({
            model: "gpt-5-mini",
            messages,
            maxTokens: 1200,
          });
          const content = res.choices?.[0]?.message?.content;
          return { answer: typeof content === "string" && content ? content : null };
        } catch (error) {
          console.error("[Assistant] LLM call failed:", error);
          return { answer: null };
        }
      }),
  }),
});

function buildPersonalContext(personal: { orders?: unknown[]; payments?: unknown[] } | undefined): string {
  if (!personal) return "\n\nCUSTOMER CONTEXT: none provided.";
  const orders = (personal.orders ?? []) as Array<Record<string, string | undefined>>;
  const payments = (personal.payments ?? []) as Array<Record<string, string | undefined>>;
  const orderLines = orders.map(o =>
    [`Store: ${o.store ?? "unknown"}`, `Status: ${o.status ?? "unknown"}`, o.date ? `Date: ${o.date}` : null]
      .filter(Boolean)
      .join(" · "),
  );
  const paymentLines = payments.map(p =>
    [`Gateway: ${p.gateway ?? "unknown"}`, `Status: ${p.status ?? "unknown"}`, p.amount && p.currency ? `Amount: ${p.amount} ${p.currency}` : null, p.reference ? `Ref: ${p.reference}` : null, p.date ? `Date: ${p.date}` : null]
      .filter(Boolean)
      .join(" · "),
  );
  const sections: string[] = [];
  if (orderLines.length > 0) sections.push("CUSTOMER ORDERS:\n" + orderLines.map(l => `- ${l}`).join("\n"));
  if (paymentLines.length > 0) sections.push("CUSTOMER PAYMENTS:\n" + paymentLines.map(l => `- ${l}`).join("\n"));
  if (sections.length === 0) return "\n\nCUSTOMER CONTEXT: none provided (no orders or payments yet).";
  return "\n\n" + sections.join("\n\n") + "\nUse this real customer data when answering questions about their orders or payments.";
}

function buildSuggestionsContext(suggestions: Array<{ store: string; category: string; why: string; offer?: string }> | undefined): string {
  if (!suggestions || suggestions.length === 0) return "";
  const lines = suggestions.map(s => `- ${s.store} (${s.category}): ${s.why}${s.offer ? " · CURRENT OFFER: " + s.offer : ""}`);
  return "\n\nPERSONALIZED STORE SUGGESTIONS (derived from this customer's order history — suggest these when relevant):\n" + lines.join("\n") + "\nWhen the customer asks for recommendations, deals, or what to shop next, suggest from this list and mention the current offer if one is listed.";
}

export type AppRouter = typeof appRouter;
