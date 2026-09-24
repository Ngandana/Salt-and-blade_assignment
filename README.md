# Salt & Blade Barber Co.

Talent Forge Junior Full-Stack Developer assessment. A complete barbershop website with
real online booking, double-booking protection and Google / Apple / Outlook calendar export.

**Deadline: Friday 25 September 2026, 17:00 SAST. Aim to submit by 14:00.**

## What's already done

- All pages: Home, Services, About, Gallery, Contact, Book, Terms & Conditions, Privacy Policy, custom 404
- Brand: name, SVG logo (header, favicon, `brand/` files), colour tokens, typography, all copy
- Booking flow: service > barber (or "any available") > date and time > details > review > confirmation
- Server-side validation, promo code `FIRSTCUT15`, and slot re-checking on submit
- Double-booking protection (in memory, or enforced by a Postgres exclusion constraint when Supabase is connected)
- Calendar: Google Calendar link, Outlook link, and a server-generated `.ics` file with a 1-hour reminder, all built from the customer's own booking
- First-visit popup (once per session, closes with X, Escape or backdrop click; code works in the booking flow)
- Mobile menu, sticky mobile "Book a chair" bar, SEO metadata, Open Graph image, sitemap, structured data
- Tested end to end in a headless browser at 375px and 1440px: no console errors and no horizontal overflow

**What's left for you:** real images (placeholders are marked "PLACEHOLDER"), Supabase (optional but recommended), deploy, test.

## Step by step

### 1. Run it locally (5 min)

```bash
npm install
npm run dev
```

Open http://localhost:3000 and click through a booking. Bookings persist in memory until you restart.

### 2. Get the images (50 min)

Follow **Prompts 1 to 3** in `docs/CLAUDE-IN-CHROME-PROMPTS.md`.

Then:
1. Move every downloaded file into the `raw-images/` folder in this project.
2. Paste the file names Claude in Chrome gives you into `raw-images/map.json`.
3. Run:
   ```bash
   npm run images
   ```
   This crops, resizes and compresses everything to WebP with the exact names the site uses (it does the Squoosh step for you). A warning appears if any photo is too small.
4. Run `npm run dev` and check every page. If a crop cuts off something important, pick a different photo for that slot and run the script again.

### 3. Connect Supabase (15 min, recommended)

Without Supabase the site still works, but bookings reset whenever Vercel starts a new server instance. With Supabase, bookings persist and the database itself makes double-booking impossible.

1. Follow **Prompt 5**. When it pauses at the SQL editor, paste all of `supabase/schema.sql` and click Run.
2. Copy the Project URL and the `service_role` key yourself.
3. Locally, create `.env.local` (copy `.env.example`) and paste them in.
4. Restart `npm run dev`, make a booking, and check that it appears in the Supabase Table Editor under `bookings`.

The service role key is only ever used on the server (API routes). Never put it in a `NEXT_PUBLIC_` variable.

### 4. Push to GitHub (5 min)

```bash
git init
git add .
git commit -m "Salt & Blade barbershop site"
git branch -M main
git remote add origin https://github.com/Ngandana/salt-and-blade.git
git push -u origin main
```

Create the empty `salt-and-blade` repository on GitHub first. It can be private.

### 5. Deploy to Vercel (10 min)

Follow **Prompt 6**. Add these environment variables yourself:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase |
| `NEXT_PUBLIC_SITE_URL` | your final `https://....vercel.app` URL |

If you change the URL later, update `NEXT_PUBLIC_SITE_URL` and redeploy, because it's used in calendar events and link previews.

### 6. Test like a reviewer (30 min)

Run **Prompt 7** on the live URL, fix anything that fails, and redeploy. Then do these by hand, because they need real devices:

- [ ] **iPhone:** book, tap "Apple Calendar", confirm the event opens in Calendar at the right time with the address.
- [ ] **Android:** book, tap "Google Calendar", confirm the time and details, and save it.
- [ ] **Laptop:** Chrome DevTools > Lighthouse > Mobile. Aim for 90+ in all four categories.
- [ ] **Timezone check:** set your computer's timezone to London, book 3:00 PM and confirm the calendar event is still 3:00 PM Cape Town time (it will show as 2:00 PM London in winter or 1:00 PM in summer, which is correct).
- [ ] Open the live URL in an incognito window to confirm it's public and needs no login.
- [ ] Search every page for the word "PLACEHOLDER". There should be none.
- [ ] Delete your test bookings from Supabase before submitting, so reviewers see free slots.

### 7. Submit

Reply to the WebMax email with your answers to their three questions and the live URL. Submit the URL only: no code, screenshots or explanations, per the brief.

## Where to change things

| To change... | Edit |
|---|---|
| Services, prices, durations, barbers, hours, address, phone, promo code | `lib/data.js` (everything updates from here) |
| Colours and fonts | `app/globals.css` (`@theme` block) |
| Logo | `components/Logo.jsx`, `app/icon.svg`, `brand/` |
| Booking rules (slot length, lead time, days ahead) | `BOOKING_RULES` in `lib/data.js` |
| Calendar event text | `lib/calendar.js` |
| Terms and privacy wording | `app/terms/page.jsx`, `app/privacy/page.jsx` |

## How the booking and calendar work

- **Time handling.** All booking maths happens in Cape Town local time (`lib/time.js`). South Africa has no daylight saving, so SAST is always UTC+2. Times are converted to UTC only for the database and calendar files. That means an appointment is always correct, whatever timezone the customer's phone is set to.
- **Slots.** Slots are generated every 15 minutes, and only offered when the whole service fits before closing. Same-day bookings need 30 minutes' notice. Sundays are closed, and the booking window is 30 days.
- **Availability.** `GET /api/availability?date=` returns busy blocks only, with no customer details. `POST /api/bookings` re-checks the slot on the server before inserting. If two people book the same slot at the same moment, the database constraint rejects the second one, and the customer is sent back to pick another time.
- **Calendar export.**
  - Google and Outlook links are built from the confirmed booking.
  - `/api/ics` returns a real `text/calendar` response, which iPhone Safari opens straight into the Calendar app.
  - End time is the start time plus the service duration.
  - Every event includes the booking reference, barber, price, address and a 1-hour reminder.

## Design notes

- **Palette.** Harbour ink `#13201F` replaces plain charcoal, to tie the palette to the sea near the shop. Brass `#CFA55B` is the accent, and barber-pole red `#B23A2E` is used only in the pole stripes. All text pairs meet 4.5:1 contrast or better.
- **Type.** Headings use Fraunces, and body text uses Instrument Sans at a 16px base with 1.5 line height. Both fonts are self-hosted, so there is no layout shift.
- **Signature details.**
  - The turning barber pole at the edge of the hero, which stops if the user prefers reduced motion.
  - Price lists with dotted leaders, like the board above a barber's mirror.
  - The ticket-style confirmation card.
- **Accessibility.**
  - Skip link, visible focus rings everywhere, and touch targets of at least 44px.
  - Real radio inputs in the booking steps.
  - Errors announced to screen readers.
  - Native `<dialog>` for the menu and popup, which handles focus trapping and Escape.
  - `prefers-reduced-motion` is respected.
- **Icons.** Lucide SVG icons, plus hand-drawn SVG social icons. No emoji anywhere.
