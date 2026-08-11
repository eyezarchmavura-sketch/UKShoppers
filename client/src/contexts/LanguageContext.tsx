/* UK Shoppers Africa — Language context (en / sw / rw / lg).
   Persists choice in localStorage; default English. */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang } from "@/lib/i18n";

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LanguageCtx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("uksa-lang") : null;
    return (saved === "en" || saved === "sw" || saved === "rw" || saved === "lg") ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("uksa-lang", lang);
  }, [lang]);

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);
