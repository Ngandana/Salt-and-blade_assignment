"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Phone, CalendarDays } from "lucide-react";
import { Logo } from "./Logo";
import { NAV, SHOP } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const menuRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => { menuRef.current?.open && menuRef.current.close(); }, [pathname]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brass focus:px-4 focus:py-3 focus:font-semibold focus:text-ink">
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
          scrolled ? "border-ink-3 bg-ink/95 backdrop-blur" : "border-transparent bg-ink"
        }`}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" aria-label={`${SHOP.name}, home`} className="rounded-md">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors duration-200 ${
                      isActive(item.href) ? "text-brass" : "text-salt hover:text-brass"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href={SHOP.phoneHref} className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm text-rope transition-colors duration-200 hover:text-salt xl:inline-flex">
              <Phone size={16} aria-hidden /> {SHOP.phone}
            </a>
            <Link href="/book" className="btn btn-primary hidden !min-h-11 !px-5 sm:inline-flex">
              <CalendarDays size={18} aria-hidden /> Book now
            </Link>
            <button
              type="button"
              onClick={() => menuRef.current?.showModal()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-3 text-salt transition-colors duration-200 hover:border-rope lg:hidden"
              aria-label="Open menu"
              aria-haspopup="dialog"
            >
              <Menu size={22} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClick={(e) => e.target === menuRef.current && menuRef.current.close()}
        className="modal-pop m-0 ml-auto h-dvh max-h-none w-[min(22rem,100vw)] max-w-none bg-ink p-0 text-salt"
      >
        <div className="flex h-full flex-col border-l border-ink-3 p-5">
          <div className="flex items-center justify-between">
            <Logo compact />
            <button
              type="button"
              autoFocus
              onClick={() => menuRef.current.close()}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-3 transition-colors duration-200 hover:border-rope"
              aria-label="Close menu"
            >
              <X size={22} aria-hidden />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-8">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => menuRef.current.close()}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex min-h-14 items-center border-b border-ink-3 font-display text-2xl transition-colors duration-200 ${
                      isActive(item.href) ? "text-brass" : "hover:text-brass"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Link href="/book" onClick={() => menuRef.current.close()} className="btn btn-primary w-full">
              <CalendarDays size={18} aria-hidden /> Book now
            </Link>
            <a href={SHOP.phoneHref} className="btn btn-ghost w-full">
              <Phone size={18} aria-hidden /> Call {SHOP.phone}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
