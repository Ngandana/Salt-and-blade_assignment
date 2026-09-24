import { ImageResponse } from "next/og";

export const alt = "Salt & Blade Barber Co., Woodstock, Cape Town";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#13201f", color: "#f1ece2", fontFamily: "serif" }}>
        <div style={{ width: 36, height: "100%", display: "flex", flexDirection: "column" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: ["#b23a2e", "#f1ece2", "#2f5d8a", "#f1ece2"][i % 4] }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px" }}>
          <div style={{ fontSize: 34, color: "#cfa55b", letterSpacing: 6 }}>BARBER CO.  |  WOODSTOCK, CAPE TOWN</div>
          <div style={{ fontSize: 124, fontWeight: 700, marginTop: 18, lineHeight: 1 }}>Salt &amp; Blade</div>
          <div style={{ fontSize: 40, marginTop: 30, color: "#9aa9a3" }}>Clean fades and hot towel shaves. Book online.</div>
        </div>
      </div>
    ),
    size
  );
}
