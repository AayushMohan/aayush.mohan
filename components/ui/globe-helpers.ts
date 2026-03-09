export type GlobePoint = {
 size: number;
 order: number;
 color: (t: number) => string;
 lat: number;
 lng: number;
};

export type PositionLike = {
 order: number;
 startLat: number;
 startLng: number;
 endLat: number;
 endLng: number;
 arcAlt: number;
 color: string;
};

export function isFiniteNumber(value: unknown): value is number {
 return typeof value === "number" && Number.isFinite(value);
}

export function hexToRgb(hex: string) {
 const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
 const normalized = hex.replace(shorthandRegex, function (m, r, g, b) {
  return r + r + g + g + b + b;
 });

 const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
 return result
  ? {
   r: parseInt(result[1], 16),
   g: parseInt(result[2], 16),
   b: parseInt(result[3], 16),
  }
  : null;
}

export function buildGlobePointsFromArcs<T extends PositionLike>(
 arcs: T[],
 pointSize: number,
): GlobePoint[] {
 const points: GlobePoint[] = [];

 for (let i = 0; i < arcs.length; i++) {
  const arc = arcs[i];
  if (
   !isFiniteNumber(arc.startLat) ||
   !isFiniteNumber(arc.startLng) ||
   !isFiniteNumber(arc.endLat) ||
   !isFiniteNumber(arc.endLng)
  ) {
   continue;
  }

  const rgb = hexToRgb(arc.color);
  if (!rgb) continue;

  const colorFn = (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`;

  points.push({
   size: pointSize,
   order: arc.order,
   color: colorFn,
   lat: arc.startLat,
   lng: arc.startLng,
  });

  points.push({
   size: pointSize,
   order: arc.order,
   color: colorFn,
   lat: arc.endLat,
   lng: arc.endLng,
  });
 }

 return dedupePointsByLatLng(points);
}

export function filterSafeArcs<T extends PositionLike>(arcs: T[]): T[] {
 return arcs.filter(
  (d) =>
   isFiniteNumber(d.startLat) &&
   isFiniteNumber(d.startLng) &&
   isFiniteNumber(d.endLat) &&
   isFiniteNumber(d.endLng) &&
   isFiniteNumber(d.arcAlt),
 );
}

const ARC_STROKES = [0.32, 0.28, 0.3] as const;

export function pickArcStroke() {
 return ARC_STROKES[Math.round(Math.random() * 2)];
}

export function getRingRepeatPeriod(
 arcTime: number,
 arcLength: number,
 rings: number,
) {
 return (arcTime * arcLength) / rings;
}

export function genRandomNumbers(min: number, max: number, count: number) {
 const arr: number[] = [];
 while (arr.length < count) {
  const r = Math.floor(Math.random() * (max - min)) + min;
  if (arr.indexOf(r) === -1) arr.push(r);
 }
 return arr;
}

function dedupePointsByLatLng(points: GlobePoint[]) {
 const seen = new Set<string>();
 const deduped: GlobePoint[] = [];

 for (const p of points) {
  const key = `${p.lat}|${p.lng}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(p);
 }

 return deduped;
}
