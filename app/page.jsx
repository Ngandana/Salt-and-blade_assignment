import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Clock, Star } from "lucide-react";
import PriceList from "@/components/PriceList";
import BarberCard from "@/components/BarberCard";
import { SERVICES, BARBERS, TESTIMONIALS, GALLERY, SHOP, HOURS_SUMMARY } from "@/lib/data";

export default function Home() {
  const featured = SERVICES.filter((s) => s.featured);
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image src="/images/hero.webp" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/30" aria-hidden />
        <div className="absolute inset-y-0 left-0 w-2.5 overflow-hidden md:w-4" aria-hidden><div className="pole" /></div>
        <div className="container-site flex min-h-[calc(100svh-4.5rem)] flex-col justify-end pb-16 pt-24 md:min-h-[42rem] md:justify-center md:pb-24">
          <p className="hero-enter flex items-center gap-2 text-rope">
            <MapPin size={16} aria-hidden /> Albert Road, Woodstock, since {SHOP.founded}
          </p>
          <h1 className="hero-enter-2 mt-4 max-w-3xl text-[2.9rem] font-semibold leading-[1.02] sm:text-6xl lg:text-[5.5rem]">
            Sharp fades. Slow shaves. No rush.
          </h1>
          <p className="hero-enter-3 mt-6 max-w-xl text-lg text-[#dcd6ca]">
            Four barbers, four chairs and a kettle that's always on. Book online in under a minute and add it straight to your calendar.
          </p>
          <div className="hero-enter-3 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className="btn btn-primary text-lg"><CalendarDays size={20} aria-hidden /> Book a chair</Link>
            <Link href="/services" className="btn btn-ghost text-lg">See services and prices</Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-ink-3 bg-ink-2">
        <ul className="container-site grid gap-4 py-5 text-sm sm:grid-cols-3">
          <li className="flex items-center gap-3"><Star size={18} className="text-brass" aria-hidden /> Rated 4.9 from 640+ Google reviews</li>
          <li className="flex items-center gap-3"><Clock size={18} className="text-brass" aria-hidden /> Late nights on Thursdays until 20:00</li>
          <li className="flex items-center gap-3"><CalendarDays size={18} className="text-brass" aria-hidden /> Walk-ins welcome when a chair is free</li>
        </ul>
      </section>

      {/* Price board */}
      <section className="bg-salt-2 text-ink">
        <div className="container-site grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <div>
            <h2 className="text-4xl font-semibold md:text-5xl">What most people come in for</h2>
            <p className="mt-4 max-w-md text-[#3d4947]">Prices include a consultation, hot lather neck shave and styling. No surprises at the till.</p>
            <Link href="/services" className="btn btn-dark mt-8">View the full menu</Link>
          </div>
          <PriceList services={featured} light />
        </div>
      </section>

      {/* Story split */}
      <section className="container-site grid items-center gap-10 py-20 md:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-2 md:aspect-[5/6]">
          <Image src="/images/interior.webp" alt="Inside Salt & Blade: vintage chairs, brass fittings and warm lighting" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="text-4xl font-semibold md:text-5xl">A proper neighbourhood shop</h2>
          <p className="mt-5 text-lg text-[#d6d0c4]">
            Salt &amp; Blade started as one chair in a converted Woodstock warehouse. Today it's four, but the rules haven't changed: take the time, get the details right and send everyone out feeling ten years younger.
          </p>
          <p className="mt-4 text-rope">Coffee from the roastery next door. Records on the turntable. Kids welcome, dogs too.</p>
          <Link href="/about" className="link-underline mt-6 inline-flex min-h-11 items-center font-medium">Read our story</Link>
        </div>
      </section>

      {/* Barbers */}
      <section className="border-t border-ink-3">
        <div className="container-site py-20 lg:py-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-4xl font-semibold md:text-5xl">Meet the chairs</h2>
            <Link href="/about#barbers" className="link-underline inline-flex min-h-11 items-center font-medium">Full barber profiles</Link>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {BARBERS.map((b) => <BarberCard key={b.id} barber={b} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink-2">
        <div className="container-site py-20 lg:py-24">
          <h2 className="text-4xl font-semibold md:text-5xl">Heard in the chair</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="border-l-2 border-brass pl-6">
                <div className="flex gap-1 text-brass" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" aria-hidden />)}
                </div>
                <blockquote className="mt-4 font-display text-xl leading-snug">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-sm text-rope"><span className="font-semibold text-salt">{t.name}</span>, {t.detail}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="container-site py-20 lg:py-28">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-4xl font-semibold md:text-5xl">Fresh off the chair</h2>
          <Link href="/gallery" className="link-underline inline-flex min-h-11 items-center font-medium">See the gallery</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {GALLERY.slice(0, 4).map((g) => (
            <div key={g.src} className="relative aspect-square overflow-hidden rounded-2xl bg-ink-2">
              <Image src={g.src} alt={g.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brass text-ink">
        <div className="on-light container-site grid gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:items-center lg:py-20">
          <div>
            <h2 className="text-4xl font-semibold md:text-5xl">Your chair is waiting.</h2>
            <p className="mt-4 max-w-lg text-lg text-ink/85">Pick a service, a barber and a time. You'll get a booking reference and a calendar reminder straight away.</p>
            <Link href="/book" className="btn btn-dark mt-8 text-lg"><CalendarDays size={20} aria-hidden /> Book now</Link>
          </div>
          <dl className="space-y-2 rounded-2xl bg-ink/[0.07] p-6">
            {HOURS_SUMMARY.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 text-[0.95rem]">
                <dt>{h.days}</dt><dd className="font-semibold">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
