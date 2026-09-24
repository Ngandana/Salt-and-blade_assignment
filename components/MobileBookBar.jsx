"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Phone } from "lucide-react";
import { SHOP } from "@/lib/data";

// Thumb-reach booking bar on phones. Hidden on the booking page itself.
export default function MobileBookBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/book")) return null;
  return (
    <>
      <div className="h-20 sm:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-3 bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <div className="flex gap-3">
          <a href={SHOP.phoneHref} className="btn btn-ghost !px-4" aria-label={`Call ${SHOP.phone}`}>
            <Phone size={18} aria-hidden />
          </a>
          <Link href="/book" className="btn btn-primary flex-1">
            <CalendarDays size={18} aria-hidden /> Book a chair
          </Link>
        </div>
      </div>
    </>
  );
}
