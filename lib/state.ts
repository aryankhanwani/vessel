import type { ActId } from "./acts";

/**
 * One mutable object shared between the DOM layer (GSAP/ScrollTrigger writes)
 * and the WebGL layer (useFrame reads). Nothing here triggers React renders —
 * that is the point: 60fps values must never touch the reconciler.
 */
export interface SceneState {
  /** 0..1 across the whole document */
  p: number;
  /** signed scroll velocity, roughly px/frame, smoothed */
  vel: number;
  /** 0..1 within each act, written by that act's ScrollTrigger */
  acts: Record<ActId, number>;
  /** normalised pointer, -1..1, already damped */
  pointer: { x: number; y: number };
  /** index of the work currently held on screen (act 03) */
  work: number;
  /** true once the intro reveal has finished */
  ready: boolean;
}

export const S: SceneState = {
  p: 0,
  vel: 0,
  acts: {
    threshold: 0,
    turning: 0,
    index: 0,
    works: 0,
    corridor: 0,
    manifesto: 0,
    signoff: 0,
  },
  pointer: { x: 0, y: 0 },
  work: 0,
  ready: false,
};

/* ---------- small maths helpers used everywhere ---------- */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** frame-rate independent damping */
export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));

/** remap v from [a,b] to 0..1, clamped */
export const range = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a));

/** remap then ease with a smoothstep */
export const smoothRange = (v: number, a: number, b: number) => {
  const t = range(v, a, b);
  return t * t * (3 - 2 * t);
};

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
