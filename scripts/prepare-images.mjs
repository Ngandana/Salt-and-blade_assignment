// Turns your raw downloads into correctly sized, compressed WebP files with the exact
// names the site expects. Same job as running each one through Squoosh, but in one command.
//
// 1. Put downloaded photos in /raw-images (any names, jpg/png/webp).
// 2. Fill in raw-images/map.json: { "hero": "downloaded-file-name.jpg", ... }
// 3. Run: npm run images
import sharp from "sharp";
import { readFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const TARGETS = {
  hero: { out: "hero.webp", w: 1920, h: 1280 },
  interior: { out: "interior.webp", w: 1200, h: 1440 },
  tools: { out: "tools.webp", w: 1200, h: 1500 },
  thabo: { out: "barbers/thabo.webp", w: 800, h: 1000 },
  yusuf: { out: "barbers/yusuf.webp", w: 800, h: 1000 },
  lindi: { out: "barbers/lindi.webp", w: 800, h: 1000 },
  ruan: { out: "barbers/ruan.webp", w: 800, h: 1000 },
  g1: { out: "gallery/g1.webp", w: 1200, h: 1200 },
  g2: { out: "gallery/g2.webp", w: 1200, h: 1200 },
  g3: { out: "gallery/g3.webp", w: 1200, h: 1200 },
  g4: { out: "gallery/g4.webp", w: 1200, h: 1200 },
  g5: { out: "gallery/g5.webp", w: 1200, h: 1200 },
  g6: { out: "gallery/g6.webp", w: 1200, h: 1200 },
};

const root = process.cwd();
const map = JSON.parse(await readFile(path.join(root, "raw-images", "map.json"), "utf8"));
let done = 0;
for (const [slot, file] of Object.entries(map)) {
  const t = TARGETS[slot];
  if (!t) { console.warn(`Skipping unknown slot "${slot}"`); continue; }
  if (!file) { console.warn(`No file set for "${slot}", keeping placeholder`); continue; }
  const src = path.join(root, "raw-images", file);
  const dest = path.join(root, "public", "images", t.out);
  await mkdir(path.dirname(dest), { recursive: true });
  const meta = await sharp(src).metadata();
  if (meta.width < t.w * 0.8) console.warn(`Warning: ${file} is only ${meta.width}px wide; ${slot} wants ${t.w}px. Download a larger size.`);
  await sharp(src).rotate().resize(t.w, t.h, { fit: "cover", position: sharp.strategy.attention }).webp({ quality: 78 }).toFile(dest);
  const kb = Math.round((await stat(dest)).size / 1024);
  console.log(`${slot.padEnd(9)} -> public/images/${t.out} (${t.w}x${t.h}, ${kb} KB)`);
  done++;
}
console.log(`\nDone: ${done} image(s). Run "npm run dev" and check each page.`);
