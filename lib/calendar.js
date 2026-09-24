import { SHOP, getService, getBarber, formatPrice } from "./data";
import { shopTimeToUTC, formatDateLong, formatTime } from "./time";

// Everything here is built from the customer's actual selection.
// Nothing is hard-coded to one appointment.

const icsStamp = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function eventFromBooking({ serviceId, barberId, date, time, ref }) {
  const service = getService(serviceId);
  const barber = getBarber(barberId);
  if (!service || !barber) return null;
  const start = shopTimeToUTC(date, time);
  const end = new Date(start.getTime() + service.duration * 60000);
  const title = `${service.name} with ${barber.name.split(" ")[0]} at ${SHOP.shortName}`;
  const description = [
    `Booking reference: ${ref}`,
    `Service: ${service.name} (${service.duration} min, ${formatPrice(service.price)})`,
    `Barber: ${barber.name}`,
    `When: ${formatDateLong(date)}, ${formatTime(time)} (Cape Town time)`,
    "",
    "Please arrive 5 minutes early. Need to change or cancel? Give us at least 24 hours' notice.",
    `Phone: ${SHOP.phone}  |  WhatsApp: ${SHOP.whatsappDisplay}`,
    `${SHOP.siteUrl}/book`,
  ].join("\n");
  return { title, description, location: `${SHOP.name}, ${SHOP.address}`, start, end, ref };
}

export function googleCalendarUrl(ev) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${icsStamp(ev.start)}/${icsStamp(ev.end)}`,
    details: ev.description,
    location: ev.location,
    ctz: "Africa/Johannesburg",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(ev) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    startdt: ev.start.toISOString(),
    enddt: ev.end.toISOString(),
    body: ev.description,
    location: ev.location,
  });
  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}

export function icsQuery({ serviceId, barberId, date, time, ref }) {
  return new URLSearchParams({ service: serviceId, barber: barberId, date, time, ref }).toString();
}

// RFC 5545 text escaping and 75-octet line folding
const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

function fold(line) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out = [];
  let current = "";
  let size = 0;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (size + len > limit) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += ch;
    size += len;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function buildIcs(ev) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Salt & Blade Barber Co.//Bookings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${ev.ref}@saltandblade.co.za`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(ev.start)}`,
    `DTEND:${icsStamp(ev.end)}`,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(ev.description)}`,
    `LOCATION:${esc(ev.location)}`,
    `URL:${SHOP.siteUrl}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Haircut at Salt & Blade in 1 hour",
    "TRIGGER:-PT1H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
