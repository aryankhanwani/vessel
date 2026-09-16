"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ACTS, ACT_RANGE } from "@/lib/acts";
import { scrollToAct } from "@/lib/lenis";
import { S } from "@/lib/state";

/** the mark: a profile, turned. drawn, not imported. */
function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse cx="12" cy="5.2" rx="6.2" ry="1.9" stroke="currentColor" strokeWidth="0.7" />
      <path
        d="M5.8 5.2c0 4.4 -3 5.6 -3 9.1C2.8 17.9 6.9 21 12 21s9.2-3.1 9.2-6.7c0-3.5-3-4.7-3-9.1"
        stroke="currentColor"
        strokeWidth="0.7"
      />
      <ellipse cx="12" cy="14.3" rx="9.2" ry="2.6" stroke="currentColor" strokeWidth="0.35" opacity="0.4" />
    </svg>
  );
}

export function Hud() {
  const [act, setAct] = useState(0);
  const [open, setOpen] = useState(false);
  const counter = useRef<HTMLSpanElement>(null);
  const ticks = useRef<(HTMLDivElement | null)[]>([]);
  const cursor = useRef<HTMLDivElement>(null);

  /* one rAF loop for every high-frequency readout — no React renders */
  useEffect(() => {
    let raf = 0;
    let current = -1;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const loop = () => {
      const p = S.p;

      if (counter.current) {
        counter.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      }

      let idx = 0;
      for (let i = 0; i < ACTS.length; i++) {
        const [a, b] = ACT_RANGE[ACTS[i].id];
        if (p >= a && p < b) idx = i;
        const tick = ticks.current[i];
        if (tick) {
          const inside = p >= a ? Math.min(1, (p - a) / (b - a)) : 0;
          tick.style.width = `${10 + inside * 24}px`;
          tick.style.backgroundColor =
            p >= a && p < b ? "var(--bone)" : inside >= 1 ? "var(--dust)" : "var(--line)";
        }
      }
      if (p >= 0.999) idx = ACTS.length - 1;
      if (idx !== current) {
        current = idx;
        setAct(idx);
      }

      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
      }

      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      gsap.to(pointer, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.55,
        ease: "power3.out",
        overwrite: true,
      });
    };
    const onOver = (e: PointerEvent) => {
      const live = !!(e.target as HTMLElement)?.closest?.("a, button");
      cursor.current?.classList.toggle("cursor--live", live);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  /* the index overlay */
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-item]");
    const ctx = gsap.context(() => {
      if (open) {
        gsap.set(el, { pointerEvents: "auto" });
        gsap.to(el, { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.fromTo(
          items,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.055,
            ease: "expo.out",
            delay: 0.08,
          },
        );
      } else {
        gsap.set(el, { pointerEvents: "none" });
        gsap.to(el, { opacity: 0, duration: 0.4, ease: "power2.in" });
      }
    }, el);
    return () => ctx.revert();
  }, [open]);

  const current = ACTS[act];

  return (
    <>
      <div ref={cursor} className="cursor" />

      {/* ---- fixed chrome: four corners, nothing across the top ---- */}
      <div className="hud">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ color: "var(--bone)", marginTop: -3 }}>
            <Mark />
          </span>
          <div>
            <div className="mono mono--bone" style={{ letterSpacing: "0.42em" }}>
              Vessel
            </div>
            <div className="mono mono--dust">Creative &amp; Production</div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div className="mono mono--dust">Act {current.n}</div>
          <div className="mono mono--bone">{current.label}</div>
        </div>

        <div />
        <div />

        <div style={{ alignSelf: "end" }}>
          <div className="mono mono--dust">
            <span ref={counter}>000</span> / 100
          </div>
          <div className="mono mono--dust">23°04′N&nbsp;&nbsp;72°35′E</div>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mono mono--bone"
          style={{
            alignSelf: "end",
            justifySelf: "end",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "var(--f-mono)",
            letterSpacing: "0.24em",
          }}
        >
          {open ? "Close" : "Index"}
        </button>
      </div>

      {/* ---- the act rail ---- */}
      <div className="rail">
        {ACTS.map((a, i) => (
          <div
            key={a.id}
            ref={(el) => {
              ticks.current[i] = el;
            }}
            className="rail__tick"
            style={{ width: 10 }}
          />
        ))}
      </div>

      {/* ---- index overlay: a list, set like a poem, not a nav ---- */}
      <div
        ref={overlay}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          opacity: 0,
          pointerEvents: "none",
          background: "rgba(8,8,10,0.88)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          padding: "calc(var(--gut) * 2.6) var(--gut)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {ACTS.map((a, i) => (
          <div
            key={a.id}
            className="rv"
            style={{ marginLeft: `${(i % 3) * 7 + (i > 3 ? 12 : 0)}vw` }}
          >
            <div data-item>
              <button
                onClick={() => {
                  setOpen(false);
                  scrollToAct(a.id);
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: "0.06em 0",
                  cursor: "pointer",
                  color: "var(--bone)",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1.1rem",
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { x: 18, duration: 0.6, ease: "expo.out" });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { x: 0, duration: 0.6, ease: "expo.out" });
                }}
              >
                <span className="mono mono--dust">{a.n}</span>
                <span className="title">{a.label}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
