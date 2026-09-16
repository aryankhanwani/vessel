import type Lenis from "lenis";
import { ACT_RANGE, type ActId } from "./acts";

export const lenisRef: { current: Lenis | null } = { current: null };

/** jump to the head of an act — used by the index overlay */
export function scrollToAct(id: ActId, immediate = false) {
  const lenis = lenisRef.current;
  const start = ACT_RANGE[id][0];
  const limit = lenis
    ? lenis.limit
    : document.documentElement.scrollHeight - window.innerHeight;
  const y = start * limit;
  if (lenis) lenis.scrollTo(y, { duration: immediate ? 0 : 1.9, lock: true });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}
