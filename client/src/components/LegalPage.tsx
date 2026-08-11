/* UK Shoppers Africa — Legal page shell
   Brand: black ink + gold. Shared layout for Privacy Policy, Terms of Service, Returns Policy.
   Renders inside PortalShell with a branded header, last-updated line, and back link. */
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export type LegalSection = { heading: string; body: string };

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="p-4 lg:p-8 max-w-[760px] mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </Link>
      <h1 className="font-display text-2xl lg:text-3xl font-bold text-primary">{title}</h1>
      <p className="text-xs text-muted-foreground mt-2">Last updated: {lastUpdated} · UK Shoppers Africa — Powered by INM LTD</p>
      <p className="text-sm text-muted-foreground leading-relaxed mt-6">{intro}</p>
      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-lg font-semibold text-foreground mb-2">{s.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
      <footer className="border-t border-border mt-10 pt-6 text-xs text-muted-foreground">
        For questions about this policy, contact us on WhatsApp at +255 763 173 629 or write to us via the contact address shown on our homepage.
      </footer>
    </div>
  );
}
