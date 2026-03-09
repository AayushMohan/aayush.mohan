export type HeroProfileImage = {
 src: string;
 alt: string;
 width: number;
 height: number;
};

export const heroName = "Aayush";

export const heroTyping = {
 speedMs: 120,
 cursorBlinkMs: 530,
} as const;

export const heroCopy = {
 rolesLabel: "Web Developer \u00a0|\u00a0 ML Enthusiast",
 introLine: "Building fast, reliable, and thoughtfully designed digital products.",
 ctaPrimary: "View My Work",
 ctaSecondary: "Get in Touch",
} as const;

export const heroProfileImage: HeroProfileImage = {
 src: "/assets/profile.jpg",
 alt: "Aayush Mohan",
 width: 144,
 height: 144,
};

export const heroRings = {
 indices: [1, 2, 3, 4] as const,
 baseSizePx: 250,
 stepPx: 200,
 borderColorByIndex: {
  3: "hsl(42 78% 55% / 0.12)",
  4: "hsl(42 78% 55% / 0.06)",
  default: "hsl(0 0% 100% / 0.03)",
 } as const,
} as const;

export function getHeroRingBorderColor(ringIndex: number) {
 if (ringIndex === 3) return heroRings.borderColorByIndex[3];
 if (ringIndex === 4) return heroRings.borderColorByIndex[4];
 return heroRings.borderColorByIndex.default;
}
