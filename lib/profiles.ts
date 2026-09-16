import * as THREE from "three";

/**
 * A lathe takes a flat profile and revolves it around an axis.
 * Every form on this site comes from one of these silhouettes — the studio's
 * whole identity is a drawn line turned through 360°.
 *
 * Control points are [radius, height]; height sits roughly in -1..1.
 */

type CP = [number, number];

const AMPHORA: CP[] = [
  [0, -1],
  [0.17, -1],
  [0.23, -0.94],
  [0.31, -0.78],
  [0.52, -0.45],
  [0.6, -0.12],
  [0.54, 0.2],
  [0.33, 0.46],
  [0.2, 0.64],
  [0.17, 0.8],
  [0.26, 0.95],
  [0.255, 1.0],
];

const COLUMN: CP[] = [
  [0, -1],
  [0.32, -1],
  [0.32, -0.93],
  [0.245, -0.85],
  [0.258, -0.4],
  [0.262, 0.0],
  [0.252, 0.42],
  [0.236, 0.84],
  [0.3, 0.89],
  [0.335, 0.97],
  [0.33, 1.02],
];

const BOWL: CP[] = [
  [0, -0.62],
  [0.22, -0.6],
  [0.42, -0.5],
  [0.62, -0.33],
  [0.75, -0.12],
  [0.8, 0.06],
  [0.81, 0.14],
  [0.8, 0.16],
];

const OBELISK: CP[] = [
  [0, -1],
  [0.35, -1],
  [0.35, -0.91],
  [0.3, -0.5],
  [0.235, 0.0],
  [0.16, 0.5],
  [0.085, 0.86],
  [0.025, 1.0],
  [0, 1.03],
];

const LENS: CP[] = [
  [0, -0.66],
  [0.24, -0.52],
  [0.56, -0.23],
  [0.71, 0],
  [0.56, 0.23],
  [0.24, 0.52],
  [0, 0.66],
];

const CHALICE: CP[] = [
  [0, -1],
  [0.28, -1],
  [0.29, -0.95],
  [0.12, -0.83],
  [0.07, -0.5],
  [0.07, -0.08],
  [0.17, 0.12],
  [0.41, 0.36],
  [0.52, 0.63],
  [0.55, 0.9],
  [0.545, 0.96],
];

/** five stacked bulbs, built rather than drawn */
const TOTEM: CP[] = (() => {
  const pts: CP[] = [
    [0, -1],
    [0.2, -1],
  ];
  const lobes = 5;
  for (let i = 0; i < lobes; i++) {
    const y0 = -1 + (i / lobes) * 2;
    const h = 2 / lobes;
    pts.push([0.13, y0 + h * 0.02]);
    pts.push([0.29 - i * 0.022, y0 + h * 0.5]);
    pts.push([0.13, y0 + h * 0.98]);
  }
  pts.push([0.1, 1.02]);
  return pts;
})();

export const PROFILE_SETS = {
  amphora: AMPHORA,
  column: COLUMN,
  bowl: BOWL,
  obelisk: OBELISK,
  lens: LENS,
  chalice: CHALICE,
  totem: TOTEM,
} as const;

export type ProfileId = keyof typeof PROFILE_SETS;

/** how many samples every profile is resampled to — equal counts allow morphing */
export const PROFILE_RES = 128;

const cache = new Map<ProfileId, THREE.Vector2[]>();

/** evenly-spaced (by arc length) samples of a profile, memoised */
export function profile(id: ProfileId): THREE.Vector2[] {
  const hit = cache.get(id);
  if (hit) return hit;
  const curve = new THREE.SplineCurve(
    PROFILE_SETS[id].map(([x, y]) => new THREE.Vector2(x, y)),
  );
  const pts = curve.getSpacedPoints(PROFILE_RES - 1);
  for (const p of pts) p.x = Math.max(p.x, 0.002);
  cache.set(id, pts);
  return pts;
}

/** allocate a scratch profile you can morph into every frame */
export function scratchProfile(): THREE.Vector2[] {
  return Array.from({ length: PROFILE_RES }, () => new THREE.Vector2());
}

/**
 * Blend two profiles into `out`. `swell` inflates the radius (used to make a
 * form breathe with scroll velocity) and `twist` is left to the mesh.
 */
export function mixProfiles(
  a: THREE.Vector2[],
  b: THREE.Vector2[],
  t: number,
  out: THREE.Vector2[],
  swell = 0,
) {
  for (let i = 0; i < PROFILE_RES; i++) {
    const pa = a[i];
    const pb = b[i];
    const x = pa.x + (pb.x - pa.x) * t;
    const y = pa.y + (pb.y - pa.y) * t;
    // swell tapers off at the ends so bases stay flat on the ground
    const falloff = Math.sin((i / (PROFILE_RES - 1)) * Math.PI);
    out[i].set(Math.max(x * (1 + swell * falloff), 0.002), y);
  }
  return out;
}

/** the order the hero form moves through as the page is scrolled */
export const HERO_SEQUENCE: ProfileId[] = [
  "amphora",
  "column",
  "chalice",
  "obelisk",
  "lens",
  "bowl",
  "totem",
  "amphora",
];
