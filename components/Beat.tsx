"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { ACTS, type ActId } from "@/lib/acts";
import { S, clamp, smoothRange } from "@/lib/state";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------- ticker --
   Every beat on the page is driven from one rAF loop. Styles are written
   straight to the element — React never sees a scroll frame.
--------------------------------------------------------------------------- */

interface Entry {
  el: HTMLElement;
  act: ActId;
  a: number;
  b: number;
  c: number;
  d: number;
  y: number;
  yOut: number;
  x: number;
  hold: boolean;
  blur: number;
}

const entries = new Set<Entry>();
let raf = 0;

function loop() {
  for (const e of entries) {
    const p = S.acts[e.act];
    const enter = smoothRange(p, e.a, e.b);
    const exit = e.hold ? 0 : smoothRange(p, e.c, e.d);
    const o = clamp(enter * (1 - exit));
    const ty = (1 - enter) * e.y + exit * e.yOut;
    const tx = (1 - enter) * e.x - exit * e.x * 0.6;
    e.el.style.opacity = String(o);
    e.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    if (e.blur) {
      const b = (1 - o) * e.blur;
      e.el.style.filter = b > 0.12 ? `blur(${b.toFixed(2)}px)` : "none";
    }
    e.el.style.visibility = o < 0.004 ? "hidden" : "visible";
  }
  raf = requestAnimationFrame(loop);
}

function register(entry: Entry) {
  entries.add(entry);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    entries.delete(entry);
    if (!entries.size) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/* ------------------------------------------------------------------ act -- */

/**
 * A stretch of scroll. The sticky stage inside it holds still while the
 * document moves, and its progress is published for the WebGL layer.
 */
export function ActSection({
  id,
  children,
}: {
  id: ActId;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const act = ACTS.find((a) => a.id === id)!;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        S.acts[id] = self.progress;
      },
      onLeave: () => {
        S.acts[id] = 1;
      },
      onLeaveBack: () => {
        S.acts[id] = 0;
      },
    });
    return () => st.kill();
  }, [id]);

  return (
    <section
      ref={ref}
      data-act={id}
      style={{ position: "relative", height: `${act.vh}svh` }}
    >
      <div className="stage">{children}</div>
    </section>
  );
}

/* ----------------------------------------------------------------- beat -- */

interface BeatProps {
  act: ActId;
  /** fade in between these two points of the act, 0..1 */
  enter: [number, number];
  /** and out between these — omit to hold to the end of the act */
  exit?: [number, number];
  /** distance travelled on the way in / on the way out, px */
  y?: number;
  yOut?: number;
  x?: number;
  blur?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * One fragment, timed against its act. Beats let a single held frame carry a
 * dozen pieces of copy that arrive and leave on their own schedule.
 */
export function Beat({
  act,
  enter,
  exit,
  y = 26,
  yOut = -26,
  x = 0,
  blur = 0,
  className = "",
  style,
  children,
}: BeatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register({
      el,
      act,
      a: enter[0],
      b: enter[1],
      c: exit ? exit[0] : 1,
      d: exit ? exit[1] : 1,
      y,
      yOut,
      x,
      hold: !exit,
      blur,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act, enter[0], enter[1], exit?.[0], exit?.[1], y, yOut, x, blur]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, willChange: "opacity, transform", ...style }}
    >
      {children}
    </div>
  );
}
