import { MapPin, Phone, Mail, Car, Train } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import ContactForm from "./ContactForm";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { SHOP, HOURS_SUMMARY } from "@/lib/data";

export const metadata = { title: "Contact and directions", description: "Find Salt & Blade Barber Co. at 74 Albert Road, Woodstock. Phone, WhatsApp, email, opening hours and parking." };

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Come say hello">Bookings are quickest online, but we're happy to hear from you however you like.</PageIntro>

      <section className="container-site grid gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-semibold">Find us</h2>
            <a href={SHOP.mapsLink} target="_blank" rel="noopener noreferrer" className="mt-4 flex gap-3 text-lg transition-colors duration-200 hover:text-brass">
              <MapPin className="mt-1 shrink-0 text-brass" size={20} aria-hidden />
              <span>{SHOP.street}, {SHOP.suburb}<br />{SHOP.city}, {SHOP.postcode}<span className="mt-1 block text-sm text-rope underline underline-offset-4">Open in Google Maps</span></span>
            </a>
            <ul className="mt-5 space-y-2 text-rope">
              <li className="flex gap-3"><Car size={18} className="mt-0.5 shrink-0" aria-hidden /> Free street parking on Albert Road and in the Woodstock Exchange lot opposite.</li>
              <li className="flex gap-3"><Train size={18} className="mt-0.5 shrink-0" aria-hidden /> Seven minutes' walk from Woodstock station. MyCiTi route 101 stops outside.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Talk to us</h2>
            <ul className="mt-4 space-y-2">
              <li><a href={SHOP.phoneHref} className="flex min-h-11 items-center gap-3 transition-colors duration-200 hover:text-brass"><Phone size={20} className="text-brass" aria-hidden /> {SHOP.phone}</a></li>
              <li><a href={SHOP.whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-3 transition-colors duration-200 hover:text-brass"><span className="text-brass"><WhatsAppIcon /></span> WhatsApp {SHOP.whatsappDisplay}</a></li>
              <li><a href={`mailto:${SHOP.email}`} className="flex min-h-11 items-center gap-3 transition-colors duration-200 hover:text-brass"><Mail size={20} className="text-brass" aria-hidden /> {SHOP.email}</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-semibold">Opening hours</h2>
            <dl className="mt-4 max-w-md space-y-2">
              {HOURS_SUMMARY.map((h) => (
                <div key={h.days} className="flex justify-between gap-4 border-b border-ink-3 pb-2">
                  <dt className="text-rope">{h.days}</dt><dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="space-y-10">
          <div className="overflow-hidden rounded-3xl border border-ink-3">
            <iframe title="Map showing Salt & Blade on Albert Road, Woodstock" src={SHOP.mapsEmbed} className="h-72 w-full md:h-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Send a message</h2>
            <p className="mt-2 text-rope">For group bookings, weddings or questions. We reply within one working day.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
