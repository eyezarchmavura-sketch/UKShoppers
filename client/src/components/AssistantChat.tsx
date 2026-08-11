import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, PackageSearch, Receipt, Send, ShoppingCart, Trash2, X } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { loadTransactions } from "@/lib/receipts";
import { demoOrders, demoTransactions } from "@/lib/demoData";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "queen-chat-conversation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type QuickAction = { key: string; prompt: string; keys: Partial<Record<Lang, string>> };

/** Quick actions that navigate the user to a portal page instead of asking a question. */
const NAV_ACTIONS: { key: string; path: string; icon: typeof PackageSearch; keys: Partial<Record<Lang, string>> }[] = [
  {
    key: "orders",
    path: "/orders",
    icon: PackageSearch,
    keys: { en: "Track Orders", sw: "Fuatilia Maagizo", rw: "Reba ibicuruzwa", lg: "Lambula Ebiragala" },
  },
  {
    key: "payments",
    path: "/payments",
    icon: Receipt,
    keys: { en: "Payment History", sw: "Historia ya Malipo", rw: "Amateka y'ubwishyu", lg: "Embalirira y'okusasula" },
  },
  {
    key: "add",
    path: "/add",
    icon: ShoppingCart,
    keys: { en: "Add Items", sw: "Ongeza Bidhaa", rw: "Ongeramo ibintu", lg: "Wandiika Ebintu" },
  },
];

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: "quote",
    prompt: "How much will it cost to send a £50 parcel of 1.5 kg to Kenya?",
    keys: { en: "Get a quote", sw: "Pata bei", rw: "Kubona igiciro", lg: "Funa ssente" },
  },
  {
    key: "address",
    prompt: "How do I get my free UK warehouse address?",
    keys: { en: "My UK address", sw: "Anwani yangu ya UK", rw: "Aderesi yanjye yo mu Bwongereza", lg: "Endagiriro ya UK" },
  },
  {
    key: "payment",
    prompt: "What payment methods do you accept?",
    keys: { en: "Payment methods", sw: "Njia za malipo", rw: "Uburyo bwo kwishyura", lg: "Enkola z'okusasula" },
  },
  {
    key: "time",
    prompt: "How long does delivery take?",
    keys: { en: "Delivery time", sw: "Muda wa usafirishaji", rw: "Igihe cyo gutanga", lg: "Obudde bw'okutwala ebintu" },
  },
];

const FALLBACK_ANSWER: Record<Lang, string> = {
  en: "Sorry, our assistant is busy right now. Please send your question on WhatsApp and the team will help you right away.",
  sw: "Samahani, msaidizi wetu ameshughulika kwa sasa. Tafadhali tuma swali lako kwenye WhatsApp na timu itakusaidia mara moja.",
  rw: "Mbabarira, umufasha wacu arahugaze. Uramutse uwohereje ikibazo cyawe kuri WhatsApp, ikipe izagufasha ako kanya.",
  lg: "Twebaza, omubuuza waffe aliko mu kusaasana. Weereza ebibuuzo byo ku WhatsApp era ttiimu ekukyabulirako.",
};

const GREETING: Record<Lang, string> = {
  en: "Habari! 👑 I'm Queen, your AI shopping assistant. I know everything about shopping in the UK and getting your parcels delivered to Tanzania, Kenya, Uganda, and Rwanda — and I can see your orders and payments to give you personal answers. Ask me anything — pricing, how it works, payments, delivery, or your UK address. How can I help you today?",
  sw: "Habari! 👑 Mimi ni Queen, msaidizi wako wa kununua. Najua kila kitu kuhusu kununua Uingereza na kusafirisha vitu kwako Tanzania, Kenya, Uganda, na Rwanda — na naweza kuona maagizo na malipo yako ili nikujibu kibinafsi. Niulize chochote — bei, jinsi inavyofanya kazi, malipo, usafirishaji, au anwani yako ya UK. Nikusaidieje leo?",
  rw: "Amakuru! 👑 Ndi Queen, umufasha wawe wo kugura. Mbona byose ku kugura mu Bwongereza no kohereza ibintu byawe mu Burundi, Kenya, Uganda, na Rwanda — kandi mbona ibicuruzwa n'ubwishyu byawe ngo ngusubize ku giti cyawe. Umbaze ibyo wifuza — ibiciro, uko bikora, kwishyura, gutanga, cyangwa aderesi yawe yo mu Bwongereza. Ngufasha iki uyu munsi?",
  lg: "Oli otya! 👑 Nze Queen, mubuuza wo ow'okugula. Manyi ebintu byonna ku kugula mu Bungereza n'okutuusa ebintu byo mu Tanzania, Kenya, Uganda, ne Rwanda — era mmanyi ebiragala n'emissolo gyo ndage okukyabulirako ku giti kyekyeka. Mbuuza kintu kyonna — ssente, engeri bwe bikola, okusasula, okutuusa, oba endagiriro yo eya UK. Nkusobola okuyamba ki leero?",
};

function loadSaved(): { messages: ChatMessage[]; language: Lang } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed?.messages) &&
      ["en", "sw", "rw", "lg"].includes(parsed?.language)
    ) {
      return { messages: parsed.messages, language: parsed.language };
    }
  } catch {
    // Corrupted entry — start fresh.
  }
  return null;
}

export default function AssistantChat() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<Lang>("en");
  const [initialized, setInitialized] = useState(false);
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.assistant.chat.useMutation({
    mutationKey: ["queen-chat", language],
  });

  // Persist conversation across page refreshes.
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, language }));
    } catch {
      // Storage unavailable — degrade gracefully.
    }
  }, [messages, language, initialized]);

  useEffect(() => {
    const saved = loadSaved();
    if (saved && saved.messages.length > 0) {
      setMessages(saved.messages);
      setLanguage(saved.language);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, pending]);

  const greet = (lang: Lang) => {
    setLanguage(lang);
    setMessages(prev => (prev.length === 0 ? [{ role: "assistant", content: GREETING[lang] }] : prev));
  };

  const send = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || pending) return;
    const history = [...messages.slice(-10)];
    setMessages(prev => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setPending(true);
    try {
      const realPayments = loadTransactions();
      const payments = (realPayments.length > 0 ? realPayments : demoTransactions).slice(0, 10).map(p =>
        "gatewayLabel" in p
          ? { gateway: p.gatewayLabel, status: p.status, amount: String(p.amountGbp ?? ""), currency: "GBP", date: p.date, reference: p.ref }
          : { gateway: p.type === "in" ? "Wallet" : "Payment", status: "completed", amount: p.amount, currency: "GBP", date: p.time, reference: p.id },
      );
      const orders = demoOrders.slice(0, 10).map(o => ({
        store: o.store ?? "UK Store",
        status: o.status,
        date: o.updatedAt ?? o.edd ?? "",
      }));
      const res = await chatMutation.mutateAsync({
        message: trimmed,
        language,
        history,
        personal: { orders, payments },
      });
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.answer ?? FALLBACK_ANSWER[language] },
      ]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: FALLBACK_ANSWER[language] }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        aria-label="Queen AI Assistant"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-[#C9A24B] to-[#A07C28] text-white shadow-lg shadow-black/25 transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        {open ? <X className="mx-auto h-6 w-6" /> : <MessageCircle className="mx-auto h-6 w-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-44 right-4 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-2xl sm:right-5">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#111114] to-[#1A1A22] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A24B]/15">
              <Bot className="h-5 w-5 text-[#C9A24B]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Queen</p>
              <p className="text-[11px] text-muted-foreground">AI Shopping Assistant · UK Shoppers Africa · 24/7</p>
            </div>
            <button
              aria-label="Clear chat"
              onClick={() => {
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch { /* ignore */ }
                setMessages([]);
              }}
              className="ml-2 rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <div className="ml-auto flex gap-1">
              {(Object.keys(GREETING) as Lang[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => greet(lang)}
                  className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium capitalize transition-colors ${
                    language === lang
                      ? "bg-[#C9A24B] text-black"
                      : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-muted/30 px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-md bg-[#111114] text-white"
                      : "rounded-bl-md border border-border bg-card"
                  }`}
                >
                  {m.role === "assistant" ? <Streamdown>{m.content}</Streamdown> : m.content}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-[#C9A24B]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          {!pending && (
            <div className="flex flex-wrap gap-1.5 border-t border-border bg-card px-4 py-2">
              {NAV_ACTIONS.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.key}
                    onClick={() => {
                      setOpen(false);
                      navigate(a.path);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-2.5 py-1 text-[11px] font-medium text-[#A07C28] transition-colors hover:bg-[#C9A24B]/20 dark:text-[#E0C06E]"
                  >
                    <Icon className="h-3 w-3" />
                    {a.keys[language] ?? a.keys.en}
                  </button>
                );
              })}
              {messages.length <= 1 &&
                QUICK_ACTIONS.map(a => (
                  <button
                    key={a.key}
                    onClick={() => send(a.prompt)}
                    className="rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 px-2.5 py-1 text-[11px] font-medium text-[#A07C28] transition-colors hover:bg-[#C9A24B]/20 dark:text-[#E0C06E]"
                  >
                    {a.keys[language] ?? a.keys.en}
                  </button>
                ))}
            </div>
          )}

          {/* Input */}
          <form
            className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5"
            onSubmit={e => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                language === "sw"
                  ? "Andika swali lako hapa…"
                  : language === "rw"
                    ? "Andika ikibazo cyawe hano…"
                    : language === "lg"
                      ? "Wandiika ekibuuzo kyo wano…"
                      : "Ask me anything about UK shopping…"
              }
              disabled={pending}
              className="h-9 flex-1 rounded-lg border border-border bg-background px-3 text-[13px] outline-none transition-colors focus:border-[#C9A24B]"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9A24B] text-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
