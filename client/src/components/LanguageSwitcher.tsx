/* UK Shoppers Africa — language switcher (en/sw/rw/lg).
   Brand: black ink + gold. Small dropdown with native labels + flags. */
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LANGS, Lang } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 font-medium rounded-full px-3 py-1.5 transition-colors hover:bg-muted active:scale-[0.97] ${
          compact ? "text-xs text-foreground/80" : "text-sm bg-muted/60 border border-border/60"
        }`}
        aria-label="Change language">
        <span>{current.flag}</span>
        <span className={!compact ? "hidden sm:inline" : ""}>{current.native}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#1a1d23] border border-border rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as Lang);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors ${
                  l.code === lang
                    ? "bg-[#111418] text-[#D4AF37] font-semibold"
                    : "text-foreground/80 hover:bg-muted"
                }`}>
                <span className="text-base">{l.flag}</span>
                <span>{l.native}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
