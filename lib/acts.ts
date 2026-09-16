export type ActId =
  | "threshold"
  | "turning"
  | "index"
  | "works"
  | "corridor"
  | "manifesto"
  | "signoff";

export interface Act {
  id: ActId;
  n: string;
  label: string;
  /** scroll length of the act, in viewport heights */
  vh: number;
}

/**
 * The whole page is one continuous take. Acts are just measured stretches of it.
 * Total ≈ 27 screens of scroll — deliberately long.
 */
export const ACTS: Act[] = [
  { id: "threshold", n: "00", label: "Threshold", vh: 240 },
  { id: "turning", n: "01", label: "Turning", vh: 460 },
  { id: "index", n: "02", label: "Index", vh: 420 },
  { id: "works", n: "03", label: "Works", vh: 560 },
  { id: "corridor", n: "04", label: "Corridor", vh: 340 },
  { id: "manifesto", n: "05", label: "Manifesto", vh: 420 },
  { id: "signoff", n: "06", label: "Sign—off", vh: 300 },
];

export const TOTAL_VH = ACTS.reduce((a, b) => a + b.vh, 0);

/**
 * Normalised [start, end] of each act along the document.
 * The scrollable distance is one viewport short of the document height, which
 * is what these are measured against — otherwise every act reads as finishing
 * slightly before it does.
 */
export const SCROLLABLE_VH = TOTAL_VH - 100;

export const ACT_RANGE: Record<ActId, [number, number]> = (() => {
  const out = {} as Record<ActId, [number, number]>;
  let cursor = 0;
  ACTS.forEach((act, i) => {
    const start = cursor / SCROLLABLE_VH;
    cursor += act.vh;
    const last = i === ACTS.length - 1;
    out[act.id] = [start, last ? 1 : cursor / SCROLLABLE_VH];
  });
  return out;
})();
