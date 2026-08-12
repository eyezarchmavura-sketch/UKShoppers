import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router, staffProcedure } from "./_core/trpc";
import { ASSISTANT_KNOWLEDGE } from "./assistantKnowledge";
import {
  ORDER_STATUS_LABELS,
  advanceOrderStatus,
  advanceOrderStatusForOperations,
  countUnreadNotifications,
  createOrder,
  createPayment,
  listNotificationsByUser,
  listOperationsOrders,
  listOrdersByUser,
  listPaymentsByUser,
  markNotificationsRead,
  upsertUser,
} from "./db";

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
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const count = (await listOrdersByUser(ctx.user.id)).length;
        const ref = `UKS-${84300 + count + Math.floor(Math.random() * 99)}`;
        await createOrder({
          ref,
          userId: ctx.user.id,
          store: input.store,
          item: input.item,
          destination: input.destination,
          deliveryAddress: input.deliveryAddress,
          amountGbp: input.amountGbp,
          amountLocal: input.amountLocal,
          currencyCode: input.currencyCode ?? "GBP",
          weightKg: input.weightKg,
          status: "pending_purchase",
          timeline: JSON.stringify([
            { at: new Date().toISOString(), status: "pending_purchase", note: "Purchase request submitted by " + (ctx.user.name ?? "customer") + "; awaiting staff quote review" },
          ]),
        });
        return { ref };
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

  operations: router({
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
