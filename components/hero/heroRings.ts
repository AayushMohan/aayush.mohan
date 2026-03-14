export function getBaseRingBorderColor(ringIndex: number) {
 if (ringIndex <= 2) return "hsl(var(--border) / 0.18)";
 if (ringIndex === 3) return "hsl(var(--border) / 0.15)";
 return "hsl(var(--border) / 0.13)";
}

export function getRingMask(ringIndex: number) {
 return `conic-gradient(from ${ringIndex * 60}deg, transparent 0deg, black 40deg, black ${140 + ringIndex * 20}deg, transparent ${180 + ringIndex * 20}deg, transparent 250deg, black 290deg, black 320deg, transparent 360deg)`;
}

export function getOrbitDotStyle(ringIndex: number) {
 const size = ringIndex <= 2 ? 5 : 7;
 const top = ringIndex <= 2 ? "-3px" : "-4px";

 return {
  width: `${size}px`,
  height: `${size}px`,
  background: `hsl(var(--border) / ${0.62 + ringIndex * 0.06})`,
  border: "1px solid hsl(var(--border) / 0.28)",
  boxShadow: `0 0 ${10 + ringIndex * 2}px hsl(var(--accent) / 0.28), 0 0 ${8 + ringIndex * 2}px hsl(var(--border) / 0.45)`,
  top,
 } as const;
}

export function getRingSizePx(
 ringIndex: number,
 baseSizePx: number,
 stepPx: number,
) {
 return `${baseSizePx + ringIndex * stepPx}px`;
}
