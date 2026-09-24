import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { SHOP, PROMO } from "@/lib/data";

export const metadata = { title: "Terms and Conditions", description: "Booking, cancellation, late arrival, pricing and promotion terms for Salt & Blade Barber Co." };

const sections = [
  ["about", "About these terms"], ["bookings", "Making a booking"], ["cancellations", "Changes and cancellations"],
  ["late", "Late arrivals and no-shows"], ["pricing", "Prices and payment"], ["promotions", "Promotions and discounts"],
  ["children", "Children"], ["health", "Health, safety and hygiene"], ["satisfaction", "If you're not happy"],
  ["liability", "Liability"], ["privacy", "Your personal information"], ["general", "General"],
];

export default function TermsPage() {
  return (
    <>
      <PageIntro title="Terms and Conditions">Last updated 24 September 2026. Plain language, no surprises. If anything is unclear, ask us before you book.</PageIntro>
      <div className="container-site grid gap-12 py-12 lg:grid-cols-[16rem_1fr] lg:py-16">
        <nav aria-label="On this page" className="h-fit lg:sticky lg:top-24">
          <h2 className="font-sans text-sm font-semibold text-rope">On this page</h2>
          <ol className="mt-3 space-y-1 text-sm">
            {sections.map(([id, label], i) => (
              <li key={id}><a href={`#${id}`} className="inline-flex min-h-9 items-center text-rope transition-colors duration-200 hover:text-brass">{i + 1}. {label}</a></li>
            ))}
          </ol>
        </nav>

        <article className="prose-legal">
          <h2 id="about" className="scroll-mt-24 !mt-0">1. About these terms</h2>
          <p>These terms apply to every appointment booked with Salt &amp; Blade Barber Co. (Pty) Ltd ("Salt &amp; Blade", "we", "us") at {SHOP.address}, whether you book online, by phone, by WhatsApp or in person. By booking, you agree to these terms. They are governed by South African law, including the Consumer Protection Act 68 of 2008, and nothing here limits your rights under that Act.</p>

          <h2 id="bookings" className="scroll-mt-24">2. Making a booking</h2>
          <ul>
            <li>A booking is confirmed once you receive a booking reference (starting with "SB-") on screen.</li>
            <li>Online bookings can be made up to 30 days in advance and at least 30 minutes before the start time.</li>
            <li>Please give accurate contact details so we can reach you if something changes.</li>
            <li>Appointment lengths are set per service so each client gets proper time. If you'd like extra services on the day, we'll add them if the next slot allows.</li>
            <li>If you choose "Any available barber", we assign the barber who is free at your chosen time.</li>
          </ul>

          <h2 id="cancellations" className="scroll-mt-24">3. Changes and cancellations</h2>
          <ul>
            <li>You can change or cancel free of charge up to 24 hours before your appointment by WhatsApp ({SHOP.whatsappDisplay}), phone ({SHOP.phone}) or email ({SHOP.email}). Quote your booking reference.</li>
            <li>Cancellations with less than 24 hours' notice may be charged 50% of the service price on your next visit.</li>
            <li>If we need to cancel or move your appointment (for example, if a barber is ill), we will contact you as early as possible and offer the next available slot or another barber. You won't be charged.</li>
          </ul>

          <h2 id="late" className="scroll-mt-24">4. Late arrivals and no-shows</h2>
          <ul>
            <li>We hold your chair for 10 minutes. After that we may shorten your service, offer a simpler service, or ask you to rebook so we don't run late for the next client.</li>
            <li>A no-show is a missed appointment without notice. After two no-shows we may ask for a deposit on future online bookings.</li>
          </ul>

          <h2 id="pricing" className="scroll-mt-24">5. Prices and payment</h2>
          <ul>
            <li>All prices are in South African rand and include VAT. Prices shown when you book are the prices you pay, even if our menu changes before your appointment.</li>
            <li>No payment is taken online. Pay after your service by card, tap or cash.</li>
            <li>Additional services agreed on the day are charged at menu prices. We'll always tell you the price before we start.</li>
          </ul>

          <h2 id="promotions" className="scroll-mt-24">6. Promotions and discounts</h2>
          <ul>
            <li>The code {PROMO.code} gives {PROMO.percent}% off one service for first-time clients only, once per person.</li>
            <li>Discounts cannot be combined, exchanged for cash or applied to products.</li>
            <li>We may end or change a promotion at any time, but a discount already applied to a confirmed booking will be honoured.</li>
          </ul>

          <h2 id="children" className="scroll-mt-24">7. Children</h2>
          <p>Children 12 and under qualify for kids' prices. A parent or guardian must stay in the shop for the full appointment, and anyone under 18 needs a parent or guardian's consent to book a shave or chemical service such as grey blending.</p>

          <h2 id="health" className="scroll-mt-24">8. Health, safety and hygiene</h2>
          <ul>
            <li>All tools are cleaned and disinfected between clients, and razors use single-use blades.</li>
            <li>Please tell us about skin conditions, allergies or sensitivities before your service. We may decline or adapt a service if it isn't safe to continue.</li>
            <li>If you're unwell with something contagious, please rebook. We'll waive the late-cancellation fee.</li>
          </ul>

          <h2 id="satisfaction" className="scroll-mt-24">9. If you're not happy</h2>
          <p>Tell us before you leave, or within 7 days. We'll fix a cut free of charge within 7 days of your appointment. This doesn't affect your rights under the Consumer Protection Act.</p>

          <h2 id="liability" className="scroll-mt-24">10. Liability</h2>
          <p>We take reasonable care with every service. We are not responsible for reactions caused by conditions you didn't tell us about, or for personal belongings left in the shop. Nothing in these terms excludes liability that cannot legally be excluded.</p>

          <h2 id="privacy" className="scroll-mt-24">11. Your personal information</h2>
          <p>We collect only what we need to manage your booking, in line with the Protection of Personal Information Act 4 of 2013 (POPIA). Read our <Link href="/privacy">Privacy Policy</Link> for details.</p>

          <h2 id="general" className="scroll-mt-24">12. General</h2>
          <p>We may update these terms from time to time. The version on this page when you book applies to that booking. Questions? Email {SHOP.email} or call {SHOP.phone}.</p>
        </article>
      </div>
    </>
  );
}
