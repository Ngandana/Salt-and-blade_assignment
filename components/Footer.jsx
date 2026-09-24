import Link from "next/link";
import { MapPin, Phone, Mail, CalendarDays } from "lucide-react";
import { Logo } from "./Logo";
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from "./SocialIcons";
import { SHOP, NAV, HOURS_SUMMARY } from "@/lib/data";

const socials = [
  { href: SHOP.social.instagram, label: "Salt & Blade on Instagram", Icon: InstagramIcon },
  { href: SHOP.social.facebook, label: "Salt & Blade on Facebook", Icon: FacebookIcon },
  { href: SHOP.social.tiktok, label: "Salt & Blade on TikTok", Icon: TikTokIcon },
  { href: SHOP.whatsapp, label: "Message Salt & Blade on WhatsApp", Icon: WhatsAppIcon },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-3 bg-[#0f1a19]">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-rope">A neighbourhood barbershop on Albert Road, cutting Woodstock's hair since {SHOP.founded}.</p>
          <ul className="mt-5 flex gap-2" aria-label="Social media">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-3 text-salt transition-colors duration-200 hover:border-brass hover:text-brass">
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-sans text-sm font-semibold text-salt">Explore</h2>
          <ul className="mt-4 space-y-1">
            {NAV.map((n) => (
              <li key={n.href}><Link href={n.href} className="inline-flex min-h-10 items-center text-rope transition-colors duration-200 hover:text-brass">{n.label}</Link></li>
            ))}
            <li><Link href="/book" className="inline-flex min-h-10 items-center text-rope transition-colors duration-200 hover:text-brass">Book an appointment</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold text-salt">Opening hours</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {HOURS_SUMMARY.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 border-b border-ink-3/70 pb-2">
                <dt className="text-rope">{h.days}</dt>
                <dd className="text-right text-salt">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-salt">Visit or get in touch</h2>
          <ul className="mt-4 space-y-3 text-rope">
            <li>
              <a href={SHOP.mapsLink} target="_blank" rel="noopener noreferrer" className="flex gap-3 transition-colors duration-200 hover:text-brass">
                <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />
                <span>{SHOP.street}, {SHOP.suburb}<br />{SHOP.city}, {SHOP.postcode}</span>
              </a>
            </li>
            <li><a href={SHOP.phoneHref} className="flex min-h-10 items-center gap-3 transition-colors duration-200 hover:text-brass"><Phone size={18} aria-hidden /> {SHOP.phone}</a></li>
            <li><a href={`mailto:${SHOP.email}`} className="flex min-h-10 items-center gap-3 break-all transition-colors duration-200 hover:text-brass"><Mail size={18} className="shrink-0" aria-hidden /> {SHOP.email}</a></li>
          </ul>
          <Link href="/book" className="btn btn-primary mt-5"><CalendarDays size={18} aria-hidden /> Book now</Link>
        </div>
      </div>

      <div className="border-t border-ink-3">
        <div className="container-site flex flex-col gap-3 py-6 text-sm text-rope md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Salt &amp; Blade Barber Co. (Pty) Ltd. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1" aria-label="Legal">
            <li><Link href="/terms" className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-brass">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-brass">Privacy Policy</Link></li>
            <li><Link href="/terms#cancellations" className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-brass">Cancellation policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
