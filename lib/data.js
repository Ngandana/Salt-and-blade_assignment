// Single source of truth for everything the site says about the shop.
// Change a price or duration here and the services page, booking flow,
// confirmation screen and calendar events all update together.

export const SHOP = {
  name: "Salt & Blade Barber Co.",
  shortName: "Salt & Blade",
  tagline: "Clean fades and hot towel shaves on Albert Road.",
  founded: 2016,
  street: "74 Albert Road",
  suburb: "Woodstock",
  city: "Cape Town",
  postcode: "7925",
  get address() {
    return `${this.street}, ${this.suburb}, ${this.city}, ${this.postcode}`;
  },
  phone: "+27 21 447 0192",
  phoneHref: "tel:+27214470192",
  whatsapp: "https://wa.me/27724180192",
  whatsappDisplay: "+27 72 418 0192",
  email: "hello@saltandblade.co.za",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=74+Albert+Road+Woodstock+Cape+Town",
  mapsEmbed:
    "https://www.google.com/maps?q=Albert+Road,+Woodstock,+Cape+Town&z=16&output=embed",
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    tiktok: "https://www.tiktok.com/",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://saltandblade.vercel.app",
};

// 0 = Sunday. null = closed. Times are Cape Town local time (SAST, UTC+2, no daylight saving).
export const HOURS = {
  0: null,
  1: { open: "09:00", close: "18:00" },
  2: { open: "09:00", close: "18:00" },
  3: { open: "09:00", close: "18:00" },
  4: { open: "09:00", close: "20:00" },
  5: { open: "09:00", close: "18:00" },
  6: { open: "08:00", close: "15:00" },
};

export const HOURS_SUMMARY = [
  { days: "Monday to Wednesday", time: "09:00 to 18:00" },
  { days: "Thursday (late night)", time: "09:00 to 20:00" },
  { days: "Friday", time: "09:00 to 18:00" },
  { days: "Saturday", time: "08:00 to 15:00" },
  { days: "Sunday and public holidays", time: "Closed" },
];

export const BOOKING_RULES = {
  slotStepMinutes: 15,
  leadTimeMinutes: 30, // same-day bookings need at least 30 minutes' notice
  maxDaysAhead: 30,
};

export const PROMO = {
  code: "FIRSTCUT15",
  percent: 15,
  label: "15% off your first visit",
};

export const CATEGORIES = [
  { id: "cuts", name: "Cuts", blurb: "Consultation, cut, wash and style. Every cut finishes with a neck shave." },
  { id: "fades", name: "Fades", blurb: "Clipper work blended by hand, from low tapers to bald skin fades." },
  { id: "beard", name: "Beard and shave", blurb: "Hot towels, straight razors and proper beard shaping." },
  { id: "kids", name: "Kids (12 and under)", blurb: "Patient barbers, a booster seat and a lollipop on the way out." },
  { id: "packages", name: "Packages", blurb: "Combinations that save time and a little money." },
  { id: "extras", name: "Extras", blurb: "Add these to any booking, or book them on their own." },
];

export const SERVICES = [
  { id: "signature-cut", category: "cuts", name: "Signature cut", price: 220, duration: 45, description: "Clipper and scissor cut tailored to your head shape, with wash and style.", featured: true },
  { id: "scissor-cut", category: "cuts", name: "Scissor-only cut", price: 250, duration: 50, description: "Longer styles cut entirely with scissors for soft, natural movement." },
  { id: "buzz-cut", category: "cuts", name: "Buzz cut", price: 140, duration: 20, description: "One length all over, sharp outline and neck shave." },

  { id: "skin-fade", category: "fades", name: "Skin fade", price: 240, duration: 45, description: "Seamless blend down to the skin, finished with a razor line-up.", featured: true },
  { id: "taper-fade", category: "fades", name: "Taper fade", price: 230, duration: 45, description: "A cleaner, more conservative fade around the ears and neckline." },
  { id: "fade-design", category: "fades", name: "Fade and design", price: 300, duration: 60, description: "Any fade plus a freehand part, pattern or line design." },

  { id: "beard-trim", category: "beard", name: "Beard trim and line-up", price: 130, duration: 25, description: "Shape, trim and a crisp razor outline on cheeks and neck." },
  { id: "hot-towel-shave", category: "beard", name: "Hot towel shave", price: 200, duration: 40, description: "Three hot towels, pre-shave oil and a straight-razor shave.", featured: true },
  { id: "beard-sculpt", category: "beard", name: "Beard sculpt and oil", price: 170, duration: 30, description: "Full reshaping for longer beards, finished with our cedar beard oil." },

  { id: "kids-cut", category: "kids", name: "Kids cut", price: 150, duration: 30, description: "Any classic cut for children 12 and under." },
  { id: "kids-fade", category: "kids", name: "Kids fade", price: 170, duration: 30, description: "Taper or skin fade for children 12 and under." },

  { id: "full-blade", category: "packages", name: "The Full Blade", price: 380, duration: 80, description: "Signature cut and hot towel shave. Our most booked package.", featured: true },
  { id: "father-son", category: "packages", name: "Father and son", price: 340, duration: 70, description: "Two cuts back to back: one adult and one child 12 and under." },
  { id: "grooms-package", category: "packages", name: "Groom's package", price: 650, duration: 120, description: "Cut, hot towel shave, beard sculpt, face mask and a whisky or coffee." },

  { id: "wash-style", category: "extras", name: "Wash and style", price: 90, duration: 15, description: "Wash, scalp massage and styling product of your choice." },
  { id: "grey-blending", category: "extras", name: "Grey blending", price: 180, duration: 30, description: "Semi-permanent colour that softens grey without looking dyed." },
  { id: "brow-tidy", category: "extras", name: "Eyebrow tidy", price: 60, duration: 10, description: "Trim and shape with scissors and razor." },
];

export const BARBERS = [
  {
    id: "thabo",
    name: "Thabo Mokoena",
    role: "Founder and master barber",
    years: 12,
    specialty: "Skin fades and tapers",
    image: "/images/barbers/thabo.webp",
    bio: "Thabo cut hair from his mother's stoep in Gugulethu before opening Salt & Blade in 2016. He is obsessive about a fade with no visible lines, and he still takes the first chair every morning.",
  },
  {
    id: "yusuf",
    name: "Yusuf Adams",
    role: "Senior barber",
    years: 9,
    specialty: "Hot towel shaves and beards",
    image: "/images/barbers/yusuf.webp",
    bio: "Bo-Kaap born and trained by his grandfather, Yusuf brings the old straight-razor ritual to every shave. If your beard needs rescuing, book Yusuf.",
  },
  {
    id: "lindi",
    name: "Lindiwe Nkosi",
    role: "Barber and designer",
    years: 7,
    specialty: "Textured hair and freehand designs",
    image: "/images/barbers/lindi.webp",
    bio: "Lindi specialises in coils, curls and freehand line work. Her designs are the ones people stop you in the street to ask about.",
  },
  {
    id: "ruan",
    name: "Ruan Pieterse",
    role: "Barber",
    years: 5,
    specialty: "Classic scissor cuts and kids",
    image: "/images/barbers/ruan.webp",
    bio: "Ruan trained in Stellenbosch and has the calmest hands in the shop, which is why parents ask for him by name. Great with longer styles and first haircuts.",
  },
];

export const TESTIMONIALS = [
  { quote: "Best skin fade I've had in Cape Town, and I've tried most of them. Thabo takes his time and it shows.", name: "Sipho M.", detail: "Regular since 2019" },
  { quote: "Booked online, got a calendar reminder, walked in and sat straight down. The hot towel shave is ridiculous.", name: "Daniel K.", detail: "Hot towel shave" },
  { quote: "Lindi did a design for my son's birthday and he hasn't stopped smiling. Kind, patient and very talented.", name: "Naledi P.", detail: "Kids fade and design" },
];

export const GALLERY = [
  { src: "/images/gallery/g1.webp", alt: "Barber taking a skin fade down with clippers" },
  { src: "/images/gallery/g2.webp", alt: "Barber shaping a full beard with scissors and comb" },
  { src: "/images/gallery/g3.webp", alt: "Hot towel wrapped around a client's face before a shave" },
  { src: "/images/gallery/g4.webp", alt: "Freehand line design cut into the side of a fade" },
  { src: "/images/gallery/g5.webp", alt: "Vintage barber chair beneath a wall of framed prints" },
  { src: "/images/gallery/g6.webp", alt: "Safety razor, comb and clippers on a wooden counter" },
];

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const formatPrice = (n) => `R${n.toLocaleString("en-ZA")}`;
export const formatDuration = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};
export const getService = (id) => SERVICES.find((s) => s.id === id);
export const getBarber = (id) => BARBERS.find((b) => b.id === id);
