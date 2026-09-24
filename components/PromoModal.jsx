"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Copy, Check } from "lucide-react";
import { PROMO } from "@/lib/data";
import { LogoMark } from "./Logo";

const KEY = "sb-promo-seen";
const SKIP = ["/book", "/terms", "/privacy"];

// First-visit offer. Appears once per session after 8 seconds or half a page of scrolling,
// never on the booking or legal pages. The code actually works in the booking flow.
export default function PromoModal() {
  const ref = useRef(null);
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (SKIP.some((p) => pathname.startsWith(p))) return;
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch {}
    if (seen) return;

    const open = () => {
      if (!ref.current || ref.current.open || document.querySelector("dialog[open]")) return;
      try { sessionStorage.setItem(KEY, "1"); } catch {}
      ref.current.showModal();
      cleanup();
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.5) open();
    };
    const timer = setTimeout(open, 8000);
    window.addEventListener("scroll", onScroll, { passive: true });
    function cleanup() { clearTimeout(timer); window.removeEventListener("scroll", onScroll); }
    return cleanup;
  }, [pathname]);

  const close = () => ref.current?.close();

  const copy = async () => {
    try { await navigator.clipboard.writeText(PROMO.code); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="promo-title"
      aria-describedby="promo-desc"
      onClick={(e) => e.target === ref.current && close()}
      className="modal-pop m-auto w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-3xl bg-salt-2 p-0 text-ink"
    >
      <div className="on-light relative">
        <div className="flex h-3" aria-hidden>
          <span className="flex-1 bg-pole" /><span className="flex-1 bg-salt" /><span className="flex-1 bg-[#2f5d8a]" /><span className="flex-1 bg-salt" /><span className="flex-1 bg-pole" />
        </div>
        <button type="button" onClick={close} aria-label="Close offer"
          className="absolute right-3 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-ink/10">
          <X size={22} aria-hidden />
        </button>
        <div className="px-7 pb-7 pt-8">
          <LogoMark className="h-12 w-12 text-brass-deep" />
          <h2 id="promo-title" className="mt-4 text-3xl font-semibold">First time in the chair?</h2>
          <p id="promo-desc" className="mt-3 text-[#34403e]">
            Take {PROMO.percent}% off your first visit. Use the code below when you book online, or show it at the counter.
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-ink/30 bg-salt px-4 py-3">
            <span className="font-mono text-xl font-semibold tracking-wider">{PROMO.code}</span>
            <button type="button" onClick={copy} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-brass-deep transition-colors duration-200 hover:bg-ink/5" aria-live="polite">
              {copied ? <><Check size={16} aria-hidden /> Copied</> : <><Copy size={16} aria-hidden /> Copy code</>}
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={`/book?promo=${PROMO.code}`} onClick={close} className="btn btn-dark flex-1">Book with {PROMO.percent}% off</Link>
            <button type="button" onClick={close} className="btn flex-1 border-[1.5px] border-ink/25 text-ink hover:bg-ink/5">Maybe later</button>
          </div>
          <p className="mt-4 text-xs text-[#4a5553]">One use per new customer. <Link href="/terms#promotions" onClick={close} className="underline underline-offset-2">Offer terms</Link></p>
        </div>
      </div>
    </dialog>
  );
}
