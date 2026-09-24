import { SHOP } from "@/lib/data";
export default function sitemap() {
  return ["", "/services", "/about", "/gallery", "/contact", "/book", "/terms", "/privacy"].map((p) => ({
    url: `${SHOP.siteUrl}${p}`, lastModified: new Date(),
  }));
}
