import { HOURS, BOOKING_RULES } from "./data";

// South Africa has no daylight saving, so SAST is always UTC+2.
// All booking maths is done in "shop local" terms (YYYY-MM-DD + HH:MM)
// and converted to UTC only when talking to calendars or the database.
// This keeps the appointment correct no matter which timezone the customer's device is in.
export const SAST_OFFSET_MIN = 120;

const pad = (n) => String(n).padStart(2, "0");

export function shopNow() {
  const d = new Date(Date.now() + SAST_OFFSET_MIN * 60000);
  return {
    date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    minutes: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
export const fromMinutes = (mins) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

export function parseDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr || "")) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return dt;
}

export function addDays(dateStr, n) {
  const dt = parseDate(dateStr);
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

export const dayOfWeek = (dateStr) => parseDate(dateStr).getUTCDay();
export const hoursFor = (dateStr) => HOURS[dayOfWeek(dateStr)] || null;

/** Shop-local date + time to a real UTC Date. */
export function shopTimeToUTC(dateStr, hhmm) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, mi) - SAST_OFFSET_MIN * 60000);
}

/** UTC Date to shop-local minutes since midnight. */
export function utcToShopMinutes(date) {
  const d = new Date(date.getTime() + SAST_OFFSET_MIN * 60000);
  return d.getUTCHours() * 60 + d.getUTCMinutes();
}

export function formatDateLong(dateStr) {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(parseDate(dateStr));
}

export function formatDateShort(dateStr) {
  return new Intl.DateTimeFormat("en-ZA", {
    weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
  }).format(parseDate(dateStr));
}

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
}

/** Is this date bookable at all (open day, not past, inside the booking window)? */
export function isBookableDate(dateStr) {
  const dt = parseDate(dateStr);
  if (!dt) return false;
  const today = shopNow().date;
  if (dateStr < today) return false;
  if (dateStr > addDays(today, BOOKING_RULES.maxDaysAhead)) return false;
  return !!hoursFor(dateStr);
}

/**
 * Build every start time for a service on a date.
 * bookings: [{ barberId, start, end }] in shop-local minutes.
 * Returns [{ time, freeBarbers: [...] }]. A slot is only offered when the whole
 * service fits before closing and at least one of the requested barbers is free.
 */
export function buildSlots({ dateStr, duration, bookings = [], barberIds }) {
  if (!isBookableDate(dateStr)) return [];
  const hours = hoursFor(dateStr);
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const now = shopNow();
  const earliest = dateStr === now.date ? now.minutes + BOOKING_RULES.leadTimeMinutes : -1;
  const slots = [];
  for (let start = open; start + duration <= close; start += BOOKING_RULES.slotStepMinutes) {
    if (start < earliest) continue;
    const end = start + duration;
    const freeBarbers = barberIds.filter(
      (id) => !bookings.some((b) => b.barberId === id && start < b.end && end > b.start)
    );
    slots.push({ time: fromMinutes(start), freeBarbers });
  }
  return slots;
}
