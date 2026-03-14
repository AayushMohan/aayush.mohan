import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/jpeg";

const theme = {
  background: "hsl(0 0% 4%)",
  foreground: "hsl(210 12% 92%)",
  textPrimary: "hsl(0 0% 95%)",
  textSecondary: "hsl(0 0% 60%)",
  textTertiary: "hsl(0 0% 40%)",
  primary: "hsl(210 10% 78%)",
  accent: "hsl(220 65% 55%)",
  accentGlow: "hsl(220 65% 55% / 0.12)",
  accentRing: "hsl(220 65% 55% / 0.35)",
  cardBorder: "hsl(0 0% 100% / 0.14)",
  portraitBackground: "hsl(240 7% 28%)",
} as const;

function arrayBufferToDataUrl(buffer: ArrayBuffer, mimeType: string) {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }

  return `data:${mimeType};base64,${btoa(binary)}`;
}

export default async function OpenGraphImage() {
  const avatarData = await fetch(
    new URL("./og-assets/profile.jpg", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const avatarSrc = arrayBufferToDataUrl(avatarData, "image/jpeg");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 48,
        padding: 72,
        backgroundColor: theme.background,
        backgroundImage: `radial-gradient(circle at 20% 30%, ${theme.accentGlow}, transparent 55%)`,
        color: theme.foreground,
        fontSize: 48,
        fontWeight: 700,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: 620,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 64,
            letterSpacing: -1,
            color: theme.textPrimary,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            color: "transparent",
            backgroundImage: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            maxWidth: 720,
            lineHeight: 1.2,
          }}
        >
          Full‑Stack Developer & ML Engineer
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 400,
            color: theme.textSecondary,
            maxWidth: 760,
            lineHeight: 1.3,
          }}
        >
          {siteConfig.description}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 22,
            fontWeight: 500,
            color: theme.textTertiary,
          }}
        >
          {new URL(siteConfig.url).host}
        </div>
      </div>

      <div
        style={{
          width: 280,
          height: 280,
          marginTop: -24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 9999,
          border: `2px solid ${theme.accentRing}`,
          backgroundColor: theme.portraitBackground,
        }}
      >
        <img
          alt={siteConfig.name}
          src={avatarSrc}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 8%",
          }}
        />
      </div>
    </div>,
    {
      ...size,
    },
  );
}
