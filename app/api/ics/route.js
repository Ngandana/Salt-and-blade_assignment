import { eventFromBooking, buildIcs } from "@/lib/calendar";
import { parseDate } from "@/lib/time";

// Serves a real text/calendar response, which iPhone Safari opens straight
// into the Calendar app ("Add to Calendar"). Built from the booking in the URL.
export async function GET(req) {
  const p = req.nextUrl.searchParams;
  const input = {
    serviceId: p.get("service"),
    barberId: p.get("barber"),
    date: p.get("date"),
    time: p.get("time"),
    ref: (p.get("ref") || "").replace(/[^A-Z0-9-]/gi, "").slice(0, 12) || "SB-BOOKING",
  };
  if (!parseDate(input.date) || !/^\d{2}:\d{2}$/.test(input.time || "")) {
    return new Response("Invalid booking details.", { status: 400 });
  }
  const ev = eventFromBooking(input);
  if (!ev) return new Response("Invalid booking details.", { status: 400 });
  return new Response(buildIcs(ev), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="salt-and-blade-${input.ref}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
