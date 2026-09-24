# Claude in Chrome prompt pack: Salt & Blade

Paste each prompt into the Claude in Chrome side panel, one at a time, in this order.
Each prompt says where Claude should stop and hand back to you. Anything involving
logins, passwords or secret keys is always done by you, not by Claude in Chrome.

Before you start, create this folder on your computer: `Downloads/salt-and-blade-assets`.
Set Chrome to ask where to save downloads (Settings > Downloads > "Ask where to save each file")
so every file lands in that folder.

| # | Prompt | Time | Output |
|---|--------|------|--------|
| 1 | Hero, interior and tools photos | 15 min | 3 photos |
| 2 | Gallery photos | 15 min | 6 photos |
| 3 | Barber portraits (ChatGPT) | 20 min | 4 portraits |
| 4 | Logo concepts (optional) | 10 min | Only if you want to change the logo |
| 5 | Supabase database | 10 min | Database with double-booking protection |
| 6 | GitHub and Vercel deploy | 15 min | Live URL |
| 7 | Live site QA run | 20 min | Bug report |

---

## Prompt 1: Hero, interior and tools photos

```
You are helping me source photography for a fictional barbershop website called
"Salt & Blade Barber Co." in Woodstock, Cape Town. The brand is moody and warm:
deep sea-green/charcoal tones, brass accents, warm tungsten lighting, vintage chairs.

Go to https://unsplash.com and find ONE photo for each slot below. If Unsplash has
nothing good for a slot, try https://www.pexels.com. Only use photos that are free
to use under the Unsplash or Pexels licence (skip anything marked Unsplash+ or premium).

SLOTS
1. "hero": landscape. A barber working on a client's fade or cut, shot from the side
   or behind, warm moody light, darker areas on the LEFT side of the frame (text will
   sit on the left). Search: "barber fade", "barbershop moody", "barber cutting hair".
2. "interior": portrait orientation. Inside of a barbershop: vintage barber chairs,
   mirrors, warm lighting, no people or people not facing the camera.
   Search: "barbershop interior", "vintage barber chair".
3. "tools": portrait orientation. Straight razor, scissors, combs, clippers laid out
   on wood or leather. Search: "barber tools", "straight razor", "barber scissors".

RULES FOR EVERY PHOTO
- Sharp and high resolution: download the "Original" or "Large" size (at least 2000px wide).
- No visible brand logos, shop signs or readable text in the photo.
- Warm or neutral colour, not cold blue or harshly lit.
- All three should look like they could be from the same shop.
- No watermarks.

For each slot: show me your top 2 candidates first (title, photographer, link) and
WAIT for me to pick before downloading. Then download the one I choose.

When all three are downloaded, give me:
a) a table with slot, downloaded file name, photographer, link
b) this exact JSON with the downloaded file names filled in:
{ "hero": "", "interior": "", "tools": "" }
```

## Prompt 2: Gallery photos

```
Same project: "Salt & Blade Barber Co.", a moody, warm, premium barbershop brand.
I need 6 SQUARE-friendly photos (subject in the centre so a square crop works)
for the gallery. Use https://unsplash.com first, then https://www.pexels.com.
Free licence only, no Unsplash+ or premium, no watermarks, no logos or readable text.

SLOTS (match these exactly, the website already has alt text for them)
g1: close-up of a fresh skin fade with a sharp line-up (search "skin fade", "fade haircut")
g2: barber shaping a full beard with scissors and comb (search "beard trim barber")
g3: hot towel on a client's face before a shave (search "hot towel shave")
g4: freehand line design cut into a fade (search "hair design fade", "haircut design")
g5: a row of vintage barber chairs in a warmly lit shop (search "barber chairs")
g6: barber tools on a wooden counter (search "barber tools wood")

Download the Large or Original size (at least 1500px on the shorter side).
Prefer photos with warm light and dark backgrounds so the set feels consistent.
Show me your top pick for each slot with a link first and WAIT for my OK before
downloading. Do not reuse any photo from the hero, interior or tools slots.

When done, give me a table (slot, file name, photographer, link) and this JSON:
{ "g1": "", "g2": "", "g3": "", "g4": "", "g5": "", "g6": "" }
```

## Prompt 3: Barber portraits (ChatGPT image generation)

I'll log in to ChatGPT myself before running this one.

```
Go to https://chatgpt.com (I am already logged in). Start a NEW chat and generate
4 portrait photos for a fictional barbershop's team page. They must look like one
consistent photoshoot. Send this style message first, exactly:

"I need 4 photorealistic portraits for a barbershop team page. Keep these identical
across all 4 images: vertical 4:5 aspect ratio; head and shoulders to mid-chest
framing; subject slightly off-centre, looking at the camera with a relaxed, confident
half-smile; background is a softly blurred dark sea-green painted wall with a hint of
a warm brass lamp; warm key light from the left, soft shadow on the right; shot on an
85mm lens at f/2; natural skin texture; each person wears a plain charcoal barber's
apron over a dark shirt with NO text, logos or lettering anywhere; no tools in hand.
Make them one at a time when I describe each person."

Then send these one at a time, waiting for each image before the next:

1. "Thabo, the founder: a Black South African man, about 38, short tapered haircut
   with a crisp line-up, neat short beard, warm and assured expression."
2. "Yusuf: a Cape Malay South African man, about 33, short dark hair, well-groomed
   full dark beard, friendly expression, rolled sleeves."
3. "Lindiwe: a Black South African woman, about 28, short natural coily hair with a
   shaved side design, small gold hoop earrings, bright confident smile."
4. "Ruan: a white Afrikaans South African man, about 27, light brown hair with a
   textured crop, short stubble, a small tattoo visible on the forearm, calm smile."

After each image, check it: hands, ears, eyes and the apron must look natural, with
no garbled text anywhere. If something is wrong, ask ChatGPT to regenerate that one
image and fix the specific problem. If after 2 retries it still looks wrong, STOP
and show me.

Download each final image in the highest quality available. Tell me the downloaded
file names in this JSON:
{ "thabo": "", "yusuf": "", "lindi": "", "ruan": "" }
```

## Prompt 4 (optional): Logo concepts

The site already ships with a finished SVG logo (straight razor over a sea swell, inside a
ring) in `brand/` and the header. Only run this if you want alternatives to compare.

```
Go to https://chatgpt.com (I'm logged in), start a new chat and send:

"Design 4 logo concepts for 'Salt & Blade Barber Co.', a barbershop in Woodstock,
Cape Town, near the harbour. Brand colours: brass #CFA55B on deep sea-green #13201F,
accent barber-pole red #B23A2E used sparingly. Style: crafted, heritage, premium,
simple enough to redraw as a single-colour SVG and still read at 32px. Ideas to
explore: a straight razor combined with a wave; crossed razor and anchor rope;
a circular badge with the razor; a monogram 'S&B'. Flat vector look, no gradients,
no photorealism, plain background. Show all 4 on one image in a 2x2 grid."

Download the image, then STOP and show me the concepts. Do not try to make an SVG.
```

## Prompt 5: Supabase database

Sign in to Supabase yourself first (free plan is fine).

```
I'm signed in to https://supabase.com/dashboard. Help me set up a database for my
barbershop booking site.

1. Click "New project". Name: salt-and-blade. Region: the closest to South Africa
   that is offered (prefer "Africa (Cape Town)" if listed, otherwise "West EU" or
   "Central EU"). For the database password: STOP and let me type it myself.
2. Wait until the project finishes setting up.
3. Open the SQL Editor, click "New query", and STOP. I will paste the SQL myself
   from supabase/schema.sql in my project. Tell me when you're ready.
4. After I say it ran, open Table Editor and confirm the tables "bookings" and
   "contact_messages" exist, and that RLS is enabled on both.
5. Go to Project Settings > API (or "API Keys"). Tell me where the Project URL and
   the service_role (secret) key are on the page, but do NOT copy, type or read out
   the secret key. I will copy both myself.
```

## Prompt 6: GitHub and Vercel deploy

Push the project to GitHub yourself first (commands are in the README), and sign in to Vercel.

```
I'm signed in to https://vercel.com and my project is on GitHub as
"salt-and-blade". Deploy it:

1. Click "Add New..." > "Project" and import the "salt-and-blade" repository.
   Framework preset should auto-detect as Next.js. Leave build settings as default.
2. Before deploying, open "Environment Variables". STOP here: I will add
   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY myself. You may add this one:
   NEXT_PUBLIC_SITE_URL = https://salt-and-blade.vercel.app
3. After I say the variables are in, click Deploy and wait for it to finish.
4. Tell me the production URL. If the build fails, open the build log and copy
   the first error message for me word for word.
5. Go to the project's Settings > Domains. If "salt-and-blade.vercel.app" is taken,
   suggest 3 clean alternatives like "saltandblade-barber.vercel.app" and STOP for
   me to choose. After I choose, tell me to update NEXT_PUBLIC_SITE_URL to match
   and redeploy.
```

## Prompt 7: Live site QA run

Run this on the live URL, and again after every fix.

```
Test my live website at [PASTE URL] like a strict reviewer of a job assessment.
Open the browser console (read_console_messages) throughout and note any errors.

A) Full journey, do this twice (once picking a specific barber, once "Any available"):
   Home > click "See services and prices" > on Services click "Book" next to
   "Skin fade" > choose a barber > pick tomorrow (or the next open day) at 3:00 PM >
   enter Name "QA Tester", Mobile "082 123 4567", Email "qa@example.com" >
   Review > enter promo code FIRSTCUT15 > tick the terms > Confirm booking.
   On the confirmation screen:
   - Read the Google Calendar button's link. Confirm it contains the service name,
     the correct date, and dates=...T130000Z/...T134500Z (3:00 PM Cape Town is 13:00 UTC,
     skin fade is 45 min).
   - Open the Google Calendar link in a new tab and confirm the event preview shows
     3:00 PM to 3:45 PM, the shop address and the booking reference. Do NOT save it.
   - Read the "Apple Calendar" link and confirm it points to /api/ics with the same
     service, barber, date and time.

B) Double-booking check: start a new booking for the SAME barber, SAME date. The
   3:00 PM and 3:15 PM and 3:30 PM slots must now be crossed out.

C) Edge cases: confirm Sundays are disabled in the date picker; confirm past dates
   are disabled; try the details form with an empty name, phone "123" and email
   "abc" and confirm each shows a clear error when you leave the field; try promo
   code "WRONG" and confirm it's rejected.

D) Every page: Home, Services, About, Gallery, Contact, Terms, Privacy, and a fake
   URL like /nope (should show a friendly 404). Click every header link, every
   footer link (including Terms, Privacy, Cancellation policy and the 4 social
   icons) and confirm nothing is broken. Submit the contact form once.

E) Popup: open the home page in a fresh incognito-style session, wait 10 seconds,
   confirm the first-visit offer appears, can be closed with the X, with Escape and
   by clicking outside, and that "Book with 15% off" pre-fills the code.

F) Responsive: resize the window to 375px, 768px and 1440px wide. At each size check
   for horizontal scrolling, overlapping text, the mobile menu opening and closing,
   and the bottom "Book a chair" bar on mobile.

Report back as a checklist: PASS or FAIL for each item, with the exact steps and
console errors for any FAIL. Also list any placeholder text or "PLACEHOLDER" images
you notice anywhere.
```
