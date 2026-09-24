import "@fontsource-variable/fraunces";
import "@fontsource-variable/instrument-sans";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoModal from "@/components/PromoModal";
import MobileBookBar from "@/components/MobileBookBar";
import { SHOP } from "@/lib/data";

export const metadata = {
  metadataBase: new URL(SHOP.siteUrl),
  title: { default: "Salt & Blade Barber Co. | Barbershop in Woodstock, Cape Town", template: "%s | Salt & Blade Barber Co." },
  description: "Skin fades, classic cuts and hot towel shaves on Albert Road, Woodstock. Book your chair online in under a minute.",
  openGraph: { type: "website", locale: "en_ZA", siteName: SHOP.name },
};

export const viewport = { themeColor: "#13201f", width: "device-width", initialScale: 1, viewportFit: "cover" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: SHOP.name,
  telephone: SHOP.phone,
  email: SHOP.email,
  url: SHOP.siteUrl,
  address: { "@type": "PostalAddress", streetAddress: SHOP.street, addressLocality: `${SHOP.suburb}, ${SHOP.city}`, postalCode: SHOP.postcode, addressCountry: "ZA" },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Friday"], opens: "09:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "20:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "15:00" },
  ],
  priceRange: "R60 to R650",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-ZA">
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
        <MobileBookBar />
        <PromoModal />
      </body>
    </html>
  );
}
