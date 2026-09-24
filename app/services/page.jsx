import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import PriceList from "@/components/PriceList";
import { CATEGORIES, SERVICES, PROMO } from "@/lib/data";

export const metadata = { title: "Services and prices", description: "Haircuts, fades, beard trims, hot towel shaves, kids cuts and packages at Salt & Blade in Woodstock, Cape Town." };

export default function ServicesPage() {
  return (
    <>
      <PageIntro title="Services and prices">
        Every service includes a consultation and finishes with a hot lather neck shave and styling. Prices in rand, VAT included.
      </PageIntro>

      <nav aria-label="Service categories" className="sticky top-[4.5rem] z-20 border-b border-ink-3 bg-ink/95 backdrop-blur">
        <ul className="container-site flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="shrink-0">
              <a href={`#${c.id}`} className="inline-flex min-h-11 items-center rounded-full border border-ink-3 px-4 text-sm font-medium transition-colors duration-200 hover:border-brass hover:text-brass">{c.name}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-site py-12 md:py-16">
        {CATEGORIES.map((c) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-40 grid gap-6 border-b border-ink-3 py-12 last:border-0 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div>
              <h2 id={`${c.id}-title`} className="text-3xl font-semibold md:text-4xl">{c.name}</h2>
              <p className="mt-3 text-rope">{c.blurb}</p>
            </div>
            <PriceList services={SERVICES.filter((s) => s.category === c.id)} />
          </section>
        ))}
      </div>

      <section className="bg-ink-2">
        <div className="container-site flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold">New here? Take {PROMO.percent}% off.</h2>
            <p className="mt-2 text-rope">Use code <span className="font-mono font-semibold text-salt">{PROMO.code}</span> when you book your first visit online.</p>
          </div>
          <Link href={`/book?promo=${PROMO.code}`} className="btn btn-primary">Book with the discount</Link>
        </div>
      </section>
    </>
  );
}
