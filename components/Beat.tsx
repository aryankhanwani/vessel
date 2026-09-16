"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { ACTS, type ActId } from "@/lib/acts";
import { S, clamp, smoothRange } from "@/lib/state";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------- ticker --
   Every beat on the page is written from one place, called by SmoothScroll
   immediately after Lenis has advanced the scroll and ScrollTrigger has
   published act progress. Sharing that clock is what keeps the copy and the
   WebGL in the same frame — a second rAF loop here would drift by one.
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
  present: boolean;
  blur: number;
  introAt: number;
  /** last written values, so we never touch the DOM for an unchanged style */
  o: number;
  ty: number;
  tx: number;
  bl: number;
  off: boolean;
}

const entries = new Set<Entry>();

export function updateBeats() {
  for (const e of entries) {
    const p = S.acts[e.act];
    const enter = e.present ? 1 : smoothRange(p, e.a, e.b);
    const exit = e.hold ? 0 : smoothRange(p, e.c, e.d);
    const staged = smoothRange(S.intro, e.introAt, Math.min(1, e.introAt + 0.45));
    const o = clamp(enter * (1 - exit) * staged);

    // the cheapest frame is the one that touches nothing: six acts out of seven
    // are always off screen, and they cost a comparison each
    if (o < 0.004) {
      if (!e.off) {
        e.el.style.visibility = "hidden";
        e.el.style.opacity = "0";
        e.off = true;
        e.o = 0;
      }
      continue;
    }
    if (e.off) {
      e.el.style.visibility = "visible";
      e.off = false;
    }

    const ty = (1 - enter) * e.y + exit * e.yOut + (1 - staged) * 24;
    const tx = (1 - enter) * e.x - exit * e.x * 0.6;

    if (Math.abs(o - e.o) > 0.002) {
      e.el.style.opacity = o.toFixed(3);
      e.o = o;
    }
    if (Math.abs(ty - e.ty) > 0.05 || Math.abs(tx - e.tx) > 0.05) {
      e.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      e.ty = ty;
      e.tx = tx;
    }
    if (e.blur) {
      // quantised: a continuously changing blur re-rasterises large type on
      // every single frame, which is the most expensive thing on the page
      const bl = Math.round((1 - o) * e.blur * 4) / 4;
      if (bl !== e.bl) {
        e.el.style.filter = bl > 0.2 ? `blur(${bl}px)` : "none";
        e.bl = bl;
      }
    }
  }
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
  /** fade in between these two points of the act — omit to be there already */
  enter?: [number, number];
  /** and out between these — omit to hold to the end of the act */
  exit?: [number, number];
  /** distance travelled on the way in / on the way out, px */
  y?: number;
  yOut?: number;
  x?: number;
  blur?: number;
  /** where in the load reveal this arrives, 0..0.55 */
  introAt?: number;
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
  introAt = 0,
  className = "",
  style,
  children,
}: BeatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const entry: Entry = {
      el,
      act,
      a: enter ? enter[0] : 0,
      b: enter ? enter[1] : 0,
      c: exit ? exit[0] : 1,
      d: exit ? exit[1] : 1,
      y,
      yOut,
      x,
      hold: !exit,
      present: !enter,
      blur,
      introAt,
      o: -1,
      ty: -9999,
      tx: -9999,
      bl: -1,
      off: false,
    };
    entries.add(entry);
    return () => {
      entries.delete(entry);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act, enter?.[0], enter?.[1], exit?.[0], exit?.[1], y, yOut, x, blur, introAt]);

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
