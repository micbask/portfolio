import { ImageResponse } from "next/og";
import { NAME, OG_ALT, OG_KICKER } from "@/content/site";

export const alt = OG_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#faf9f7",
          color: "#16181a",
          padding: "84px 92px",
        }}
      >
        <div style={{ display: "flex", height: 3, width: 140, backgroundColor: "#2f5d62" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, letterSpacing: -2, lineHeight: 1.05 }}>{NAME}</div>
          <div
            style={{
              marginTop: 26,
              fontSize: 38,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#565d65",
            }}
          >
            {OG_KICKER}
          </div>
        </div>
        <div style={{ display: "flex", height: 1, width: "100%", backgroundColor: "#e4e1db" }} />
      </div>
    ),
    size,
  );
}
