"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseDate, isBookableDate, formatDateLong, hoursFor } from "@/lib/time";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const pad = (n) => String(n).padStart(2, "0");

export default function DatePicker({ value, onChange, minDate, maxDate }) {
  const initial = parseDate(value || minDate);
  const [view, setView] = useState({ y: initial.getUTCFullYear(), m: initial.getUTCMonth() });

  const days = useMemo(() => {
    const first = new Date(Date.UTC(view.y, view.m, 1));
    const offset = (first.getUTCDay() + 6) % 7; // Monday-first weeks
    const count = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    const cells = Array(offset).fill(null);
    for (let d = 1; d <= count; d++) cells.push(`${view.y}-${pad(view.m + 1)}-${pad(d)}`);
    return cells;
  }, [view]);

  const monthLabel = new Intl.DateTimeFormat("en-ZA", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(view.y, view.m, 1))
  );
  const minKey = minDate.slice(0, 7);
  const maxKey = maxDate.slice(0, 7);
  const viewKey = `${view.y}-${pad(view.m + 1)}`;
  const shift = (n) => setView(({ y, m }) => {
    const d = new Date(Date.UTC(y, m + n, 1));
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  });

  return (
    <div className="rounded-2xl border border-ink-3 bg-ink-2 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={viewKey <= minKey}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-ink-3 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous month">
          <ChevronLeft size={20} aria-hidden />
        </button>
        <p className="font-display text-xl font-semibold" aria-live="polite">{monthLabel}</p>
        <button type="button" onClick={() => shift(1)} disabled={viewKey >= maxKey}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 hover:bg-ink-3 disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next month">
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center" role="grid" aria-label={monthLabel}>
        {WEEKDAYS.map((w) => (
          <div key={w} role="columnheader" className="pb-2 text-xs font-semibold text-rope">{w}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e${i}`} aria-hidden />;
          const bookable = isBookableDate(d);
          const selected = d === value;
          const closed = !hoursFor(d);
          return (
            <button
              key={d}
              type="button"
              disabled={!bookable}
              onClick={() => onChange(d)}
              aria-pressed={selected}
              aria-label={`${formatDateLong(d)}${closed ? ", closed" : !bookable ? ", unavailable" : ""}`}
              className={`mx-auto flex h-11 w-full max-w-11 items-center justify-center rounded-full text-[0.95rem] tabular-nums transition-colors duration-200 ${
                selected
                  ? "bg-brass font-semibold text-ink"
                  : bookable
                  ? "text-salt hover:bg-ink-3"
                  : "text-[#5d6d68] line-through decoration-1"
              }`}
            >
              {Number(d.slice(8))}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-rope">Closed on Sundays. Bookings open up to 30 days ahead.</p>
    </div>
  );
}
