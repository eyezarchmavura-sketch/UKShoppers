import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { invokeLLM } from "./_core/llm";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ASSISTANT_KNOWLEDGE } from "./assistantKnowledge";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),

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
        const systemPrompt = `${ASSISTANT_KNOWLEDGE}${personalContext}\n\nYou are named Queen. Respond warmly and briefly in ${languageLabel[input.language].toUpperCase()}. If the customer asks about their own orders or payments and personal context was provided, reference the actual data (status, reference, amounts, dates). If personal context was not provided or empty, explain that the customer can check their dashboard or share details so you can help.`;
        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...input.history.map(m => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: input.message },
        ];
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

export type AppRouter = typeof appRouter;
