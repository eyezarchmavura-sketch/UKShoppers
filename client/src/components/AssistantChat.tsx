import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, PackageSearch, Receipt, Send, ShoppingCart, Trash2, X } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import type { Lang } from "@/lib/i18n";

const STORAGE_KEY = "queen-chat-conversation";

/** Catalog of stores on the platform with categories, for affinity suggestions. */
const STORE_CATALOG: { name: string; category: string; offers: string }[] = [
  { name: "Nike UK", category: "Fashion", offers: "Seasonal sneaker drops and up-to-30% outlet discounts" },
  { name: "Adidas UK", category: "Fashion", offers: "End-of-season sportswear clearance" },
  { name: "JD Sports", category: "Sport & Outdoors", offers: "Trainer bundles and club discounts" },
  { name: "Foot Locker", category: "Sport & Outdoors", offers: "Member-exclusive trainer releases" },
  { name: "Zara UK", category: "Fashion", offers: "Mid-season sale on selected styles" },
  { name: "ASOS", category: "Fashion", offers: "Up-to-50% off sale styles, student discount" },
  { name: "H&M UK", category: "Fashion", offers: "Member price cuts and seasonal offers" },
  { name: "Marks & Spencer", category: "Fashion", offers: "Food & fashion seasonal promotions" },
  { name: "Next UK", category: "Fashion", offers: "Multi-buy discounts on family fashion" },
  { name: "Primark Online", category: "Fashion", offers: "Budget basics below £10" },
  { name: "Boots", category: "Beauty & Health", offers: "Advantage Card triple points events" },
  { name: "Superdrug", category: "Beauty & Health", offers: "Health & Beauty card 3-for-2 deals" },
  { name: "Sephora UK", category: "Beauty & Health", offers: "Beauty Insider reward offers" },
  { name: "The Body Shop", category: "Beauty & Health", offers: "Seasonal gift set bundles" },
  { name: "Apple UK", category: "Electronics", offers: "Trade-in value and student pricing" },
  { name: "John Lewis", category: "Electronics", offers: "Extended warranty on tech, seasonal tech sales" },
  { name: "Argos", category: "Electronics", offers: "Clearance events on home tech" },
  { name: "Currys", category: "Electronics", offers: "Member price-match and open-box deals" },
  { name: "Sports Direct", category: "Sport & Outdoors", offers: "Heavy discounts on branded sportswear" },
  { name: "Decathlon UK", category: "Sport & Outdoors", offers: "Own-brand gear below market price" },
  { name: "IKEA UK", category: "Home & Kitchen", offers: "Family Room deals and As-Is bargains" },
  { name: "Lakeland", category: "Home & Kitchen", offers: "Kitchen bundle offers" },
  { name: "Amazon UK", category: "Marketplace", offers: "Daily lightning deals across all categories" },
  { name: "eBay UK", category: "Marketplace", offers: "Auction bargains and refurbished tech" },
  { name: "HMV", category: "Entertainment", offers: "Collectibles and vinyl sales" },
];

/** Stores whose customers typically buy from each other (same category affinity). */
const AFFINITY: Record<string, string[]> = {
  "Nike UK": ["JD Sports", "Adidas UK", "Sports Direct", "Foot Locker", "Decathlon UK"],
  "Adidas UK": ["Nike UK", "JD Sports", "Sports Direct", "Foot Locker", "Decathlon UK"],
  "JD Sports": ["Nike UK", "Adidas UK", "Foot Locker", "Sports Direct", "Decathlon UK"],
  "Foot Locker": ["Nike UK", "JD Sports", "Adidas UK", "Sports Direct"],
  "Sports Direct": ["Nike UK", "Adidas UK", "JD Sports", "Decathlon UK"],
  "Decathlon UK": ["Nike UK", "Adidas UK", "JD Sports", "Sports Direct"],
  "Zara UK": ["ASOS", "H&M UK", "Marks & Spencer", "Next UK"],
  "ASOS": ["Zara UK", "H&M UK", "Primark Online", "Next UK"],
  "H&M UK": ["ASOS", "Zara UK", "Primark Online", "Next UK"],
  "Marks & Spencer": ["Zara UK", "Next UK", "ASOS", "John Lewis"],
  "Next UK": ["Marks & Spencer", "Zara UK", "ASOS", "H&M UK"],
  "Primark Online": ["ASOS", "H&M UK", "Zara UK"],
  "Boots": ["Superdrug", "The Body Shop", "Sephora UK", "Marks & Spencer"],
  "Superdrug": ["Boots", "The Body Shop", "Sephora UK"],
  "Sephora UK": ["Boots", "Superdrug", "The Body Shop"],
  "The Body Shop": ["Boots", "Superdrug", "Sephora UK"],
  "Apple UK": ["John Lewis", "Currys", "Argos", "Amazon UK"],
  "John Lewis": ["Apple UK", "Currys", "Argos", "Marks & Spencer"],
  "Argos": ["Currys", "John Lewis", "Amazon UK", "IKEA UK"],
  "Currys": ["John Lewis", "Argos", "Apple UK", "Amazon UK"],
  "Amazon UK": ["eBay UK", "Argos", "Currys", "Boots"],
  "eBay UK": ["Amazon UK", "Argos", "HMV", "Currys"],
  "HMV": ["eBay UK", "Amazon UK"],
  "IKEA UK": ["Lakeland", "Argos", "John Lewis"],
  "Lakeland": ["IKEA UK", "Argos", "John Lewis"],
};

function buildSuggestions(orderedStores: string[]): Array<{ store: string; category: string; why: string; offer: string }> {
  const catalogByName = new Map(STORE_CATALOG.map(s => [s.name, s]));
  const seen = new Set<string>();
  const result: Array<{ store: string; category: string; why: string; offer: string }> = [];
  for (const store of orderedStores) {
    const related = (AFFINITY[store] ?? []).filter(r => !seen.has(r));
    for (const r of related) {
      if (seen.has(r) || result.length >= 5) break;
      const cat = catalogByName.get(r);
      if (!cat) continue;
      seen.add(r);
      result.push({
        store: cat.name,
        category: cat.category,
        why: `customers who shop at ${store} often order from here too`,
        offer: cat.offers,
      });
    }
  }
  return result;
}

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
  const { isAuthenticated } = useAuth();
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

  // Real unread order-status notification count — drives the Queen badge.
  const { data: unreadCount, refetch: refetchUnread } = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const { data: customerNotifications } = trpc.notifications.list.useQuery(undefined, {
    enabled: isAuthenticated && open,
    retry: false,
  });
  const { data: customerOrders } = trpc.orders.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const { data: customerPayments } = trpc.payments.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const markRead = trpc.notifications.markRead.useMutation();
  const unread = isAuthenticated ? (unreadCount ?? 0) : 0;

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

  const dismissUpdates = () => {
    // Mark real unread notifications as read on first open.
    if (isAuthenticated) {
      markRead.mutate(undefined, { onSuccess: () => refetchUnread() });
    }
  };

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
      const payments = (customerPayments ?? []).slice(0, 10).map(payment => ({
        gateway: payment.gateway,
        status: payment.status,
        amount: String(payment.amount),
        currency: payment.currencyCode ?? "GBP",
        date: payment.createdAt.toISOString(),
        reference: payment.ref,
      }));
      const orders = (customerOrders ?? []).slice(0, 10).map(order => ({
        store: order.store,
        status: order.status,
        date: order.updatedAt.toISOString(),
      }));
      const orderedStores = Array.from(new Set(orders.map(o => o.store).filter(Boolean))) as string[];
      const suggestions = buildSuggestions(orderedStores);
      const res = await chatMutation.mutateAsync({
        message: trimmed,
        language,
        history,
        personal: { orders, payments, suggestions },
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
        onClick={() => setOpen(v => { if (!v) dismissUpdates(); return !v; })}
        className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-[#C9A24B] to-[#A07C28] text-white shadow-lg shadow-black/25 transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        {open ? <X className="mx-auto h-6 w-6" /> : <MessageCircle className="mx-auto h-6 w-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
            {unread}
          </span>
        )}
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
            {isAuthenticated && customerNotifications && customerNotifications.filter((notification) => notification.read === "no").length > 0 && messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#A07C28] dark:text-[#E0C06E]">New updates from Queen</p>
                {customerNotifications.filter((notification) => notification.read === "no").map(notification => (
                  <button
                    key={notification.id}
                    onClick={() => send(`Please explain this order update: ${notification.title}. ${notification.body}`)}
                    className="flex w-full items-center gap-2 rounded-xl border border-[#C9A24B]/30 bg-[#C9A24B]/10 px-3 py-2 text-left transition-colors hover:bg-[#C9A24B]/20"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A24B] text-[10px] font-bold text-black">!</span>
                    <span className="text-[12px] font-medium text-foreground">{notification.title}</span>
                    <Send className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
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
