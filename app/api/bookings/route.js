import { NextResponse } from "next/server";
import { getService, BARBERS, PROMO } from "@/lib/data";
import { buildSlots, isBookableDate, shopTimeToUTC, utcToShopMinutes, addDays } from "@/lib/time";
import { listBookingsBetween, insertBooking, SlotTakenError } from "@/lib/store";
import { validators } from "@/lib/validate";

export const dynamic = "force-dynamic";

const makeRef = () => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SB-${s}`;
};

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { serviceId, barberId, date, time, name, phone, email, notes, promo, acceptTerms } = body || {};

  const service = getService(serviceId);
  if (!service) return NextResponse.json({ error: "Choose a service." }, { status: 400 });
  const wantsAny = barberId === "any";
  if (!wantsAny && !BARBERS.some((b) => b.id === barberId))
    return NextResponse.json({ error: "Choose a barber." }, { status: 400 });
  if (!isBookableDate(date)) return NextResponse.json({ error: "That date can't be booked. Choose another day." }, { status: 400 });
  if (!/^\d{2}:\d{2}$/.test(time || "")) return NextResponse.json({ error: "Choose a time." }, { status: 400 });

  const fieldErrors = {
    name: validators.name(name),
    phone: validators.phone(phone),
    email: validators.email(email),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return NextResponse.json({ error: "Check your details.", fieldErrors }, { status: 422 });
  if (!acceptTerms) return NextResponse.json({ error: "Accept the booking terms to continue." }, { status: 422 });

  const promoCode = (promo || "").trim().toUpperCase();
  if (promoCode && promoCode !== PROMO.code)
    return NextResponse.json({ error: `The code "${promoCode}" isn't valid.` }, { status: 422 });

  // Re-check availability on the server, then insert. The database constraint is the final guard.
  const from = shopTimeToUTC(date, "00:00");
  const to = shopTimeToUTC(addDays(date, 1), "00:00");
  const rows = await listBookingsBetween(from, to);
  const busy = rows.map((r) => ({ barberId: r.barberId, start: utcToShopMinutes(r.start), end: utcToShopMinutes(r.end) }));
  const candidates = wantsAny ? BARBERS.map((b) => b.id) : [barberId];
  const slot = buildSlots({ dateStr: date, duration: service.duration, bookings: busy, barberIds: candidates }).find(
    (s) => s.time === time
  );
  if (!slot || slot.freeBarbers.length === 0)
    return NextResponse.json({ error: "That time was just taken. Pick another slot.", code: "SLOT_TAKEN" }, { status: 409 });

  const start = shopTimeToUTC(date, time);
  const end = new Date(start.getTime() + service.duration * 60000);
  const total = promoCode ? Math.round(service.price * (1 - PROMO.percent / 100)) : service.price;

  for (const assigned of slot.freeBarbers) {
    const booking = {
      ref: makeRef(),
      serviceId, barberId: assigned, date, time, start, end,
      name: name.trim(), phone: phone.trim(), email: email.trim().toLowerCase(),
      notes: (notes || "").slice(0, 500), promo: promoCode || null, total,
    };
    try {
      await insertBooking(booking);
      return NextResponse.json({
        booking: { ref: booking.ref, serviceId, barberId: assigned, date, time, total, promo: booking.promo, name: booking.name, email: booking.email },
      });
    } catch (e) {
      if (e instanceof SlotTakenError) continue; // try the next free barber when "any" was chosen
      return NextResponse.json({ error: "We couldn't save your booking. Try again, or call us to book." }, { status: 500 });
    }
  }
  return NextResponse.json({ error: "That time was just taken. Pick another slot.", code: "SLOT_TAKEN" }, { status: 409 });
}
