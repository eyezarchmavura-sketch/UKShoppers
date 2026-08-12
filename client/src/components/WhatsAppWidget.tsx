/* Floating WhatsApp Support Widget for East African Clients */
import { useState } from "react";
import { MessageCircle, X, Send, PhoneCall } from "lucide-react";
import { toast } from "sonner";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(
    "Hi UK Shoppers Africa! I'd like a quote for an order from a UK store. My destination is "
  );

  const quickQuestions = [
    "Get a quote for my order",
    "What are your shipping rates?",
    "How long does delivery take?",
  ];

  const askQuick = (q: string) => {
    setMsg(q);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const phone = "255763173629"; // Isaac Mavura WhatsApp
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setMsg("");
    setOpen(false);
    toast.success("Opening WhatsApp chat with UK Shoppers Africa support team...");
  };

  return (
    <div className="fixed bottom-6 right-6 bottom-32 sm:bottom-6 z-50">
      {open ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-border w-80 sm:w-96 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#0A3622] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F6E05E] text-[#0A3622] flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">UK Shoppers Africa Support</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Online · Typically replies in 5m
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#F4F7F6] space-y-3 text-xs">
            <div className="bg-white rounded-2xl p-3 shadow-xs border border-border/60 max-w-[85%] text-foreground">
              <p className="font-semibold text-[#0A3622]">Jambo! 👋 Welcome to UK Shoppers Africa.</p>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                Need help with a UK shopping link, customs clearance in Tanzania, Kenya, Uganda or Rwanda? Ask us anything here!
              </p>
              <span className="text-[10px] text-muted-foreground/60 mt-1 block">Just now</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => askQuick(q)}
                  className="bg-white border border-[#0A3622]/20 text-[#0A3622] rounded-full px-3 py-1.5 text-[11px] font-medium hover:bg-[#F6E05E]/40 transition-colors active:scale-[0.97]">
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-border flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your question..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="flex-1 rounded-xl bg-[#F4F7F6] px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3622]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-xl bg-[#0A3622] text-[#F6E05E] flex items-center justify-center hover:bg-[#0A3622]/90 transition-all shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2.5 bg-[#25D366] text-white px-5 py-3.5 rounded-full shadow-xl hover:bg-[#20ba5a] transition-all active:scale-[0.97] font-semibold text-sm max-sm:px-4 max-sm:py-3">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>Chat on WhatsApp</span>
        </button>
      )}
    </div>
  );
}
