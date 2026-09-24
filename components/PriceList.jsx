import Link from "next/link";
import { formatPrice, formatDuration } from "@/lib/data";

// A barbershop price board: name, dotted leader, price. Each row books that exact service.
export default function PriceList({ services, light = false, showBook = true }) {
  return (
    <ul className={light ? "on-light divide-y divide-ink/15" : "divide-y divide-ink-3"}>
      {services.map((s) => (
        <li key={s.id} className="grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <div className="flex items-baseline gap-3">
              <h3 className={`font-display text-xl font-semibold md:text-2xl ${light ? "text-ink" : "text-salt"}`}>{s.name}</h3>
              <span className="leader" aria-hidden />
              <span className={`font-display text-xl font-semibold tabular-nums md:text-2xl ${light ? "text-brass-deep" : "text-brass"}`}>
                <span className="sr-only">Price: </span>{formatPrice(s.price)}
              </span>
            </div>
            <p className={`mt-1.5 max-w-prose ${light ? "text-[#3d4947]" : "text-rope"}`}>
              {s.description} <span className={light ? "text-ink" : "text-salt"}>{formatDuration(s.duration)}.</span>
            </p>
          </div>
          {showBook && (
            <Link
              href={`/book?service=${s.id}`}
              className={`btn !min-h-11 !px-5 text-sm justify-self-start ${light ? "border-[1.5px] border-ink/30 text-ink hover:border-ink hover:bg-ink/5" : "btn-ghost"}`}
              aria-label={`Book ${s.name}, ${formatPrice(s.price)}`}
            >
              Book
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
