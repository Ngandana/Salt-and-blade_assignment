import { createClient } from "@supabase/supabase-js";

// Bookings storage. Uses Supabase when the env vars are present, otherwise
// falls back to server memory so the site still works end to end in a demo.

export class SlotTakenError extends Error {}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

const memory = (globalThis.__saltBladeBookings ||= []);

export async function listBookingsBetween(fromUtc, toUtc) {
  if (supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select("barber_id,start_at,end_at")
      .lt("start_at", toUtc.toISOString())
      .gt("end_at", fromUtc.toISOString());
    if (error) throw error;
    return data.map((r) => ({ barberId: r.barber_id, start: new Date(r.start_at), end: new Date(r.end_at) }));
  }
  return memory
    .filter((b) => b.start < toUtc && b.end > fromUtc)
    .map((b) => ({ barberId: b.barberId, start: b.start, end: b.end }));
}

export async function insertBooking(b) {
  if (supabase) {
    const { error } = await supabase.from("bookings").insert({
      ref: b.ref,
      service_id: b.serviceId,
      barber_id: b.barberId,
      start_at: b.start.toISOString(),
      end_at: b.end.toISOString(),
      customer_name: b.name,
      customer_phone: b.phone,
      customer_email: b.email,
      notes: b.notes || null,
      promo_code: b.promo || null,
      total: b.total,
    });
    // 23P01 = exclusion constraint violation (overlapping booking for this barber)
    if (error?.code === "23P01" || error?.code === "23505") throw new SlotTakenError();
    if (error) throw error;
    return;
  }
  const clash = memory.some((x) => x.barberId === b.barberId && b.start < x.end && b.end > x.start);
  if (clash) throw new SlotTakenError();
  memory.push(b);
}

export async function insertMessage(m) {
  if (supabase) {
    const { error } = await supabase.from("contact_messages").insert(m);
    if (error) throw error;
  }
}
