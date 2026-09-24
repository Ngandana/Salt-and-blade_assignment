import { SHOP } from "@/lib/data";
export default function robots() {
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${SHOP.siteUrl}/sitemap.xml` };
}
