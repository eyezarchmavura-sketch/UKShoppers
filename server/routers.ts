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
        }),
      )
      .mutation(async ({ input }) => {
        const languageLabel: Record<string, string> = {
          en: "English",
          sw: "Kiswahili",
          rw: "Ikinyarwanda",
          lg: "Oluganda",
        };
        const systemPrompt = `${ASSISTANT_KNOWLEDGE}\n\nRESPOND IN ${languageLabel[input.language].toUpperCase()}.`;
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

export type AppRouter = typeof appRouter;
