import { NextResponse } from "next/server";
import { listBookingsBetween } from "@/lib/store";
import { parseDate, shopTimeToUTC, utcToShopMinutes, addDays } from "@/lib/time";

export const dynamic = "force-dynamic";

// Returns busy blocks for a day (no customer details), in shop-local minutes.
export async function GET(req) {
  const date = req.nextUrl.searchParams.get("date");
  if (!parseDate(date)) return NextResponse.json({ error: "Invalid date." }, { status: 400 });
  const from = shopTimeToUTC(date, "00:00");
  const to = shopTimeToUTC(addDays(date, 1), "00:00");
  try {
    const rows = await listBookingsBetween(from, to);
    const bookings = rows.map((r) => ({
      barberId: r.barberId,
      start: Math.max(0, r.start < from ? 0 : utcToShopMinutes(r.start)),
      end: r.end > to ? 24 * 60 : utcToShopMinutes(r.end),
    }));
    return NextResponse.json({ bookings }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not load availability. Try again in a moment." }, { status: 500 });
  }
}
