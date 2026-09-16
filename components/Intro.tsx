"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Mark } from "@/components/Mark";
import { lenisRef } from "@/lib/lenis";
import { S } from "@/lib/state";

/** resolves when the webfonts have landed, or gives up rather than hang */
function fontsReady() {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return Promise.race([
    document.fonts.ready,
    new Promise((r) => setTimeout(r, 3500)),
  ]);
}

/** resolves on the first frame the WebGL scene actually renders */
function sceneReady() {
  return new Promise<void>((resolve) => {
    const t0 = performance.now();
    const check = () => {
      if (S.sceneReady || performance.now() - t0 > 6000) resolve();
      else requestAnimationFrame(check);
    };
    check();
  });
}

const MIN_MS = 1250;

/**
 * The loader. A count, a rule that fills as the studio arrives, and then the
 * lid comes off: the cover opens, the silhouette draws itself, and the opening
 * copy stages in behind it. Nothing moves faster than it needs to.
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    lenisRef.current?.stop();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = { v: 0 };
    gsap.set(rule.current, { xPercent: -50, scaleX: 0 });

    const paint = () => {
      const v = count.v;
      if (num.current) {
        num.current.textContent = String(Math.round(v * 100)).padStart(3, "0");
      }
      // via gsap so the centring transform isn't clobbered
      if (rule.current) gsap.set(rule.current, { scaleX: v });
    };

    // creep to 90% on a curve, then let the last 10% be the truth
    const creep = gsap.to(count, {
      v: 0.9,
      duration: 1.1,
      ease: "power1.inOut",
      onUpdate: paint,
    });

    let exit: gsap.core.Timeline | null = null;

    const open = () => {
      exit = gsap.timeline({
        onComplete: () => {
          lenisRef.current?.start();
          setGone(true);
        },
      });

      exit
        .to(count, { v: 1, duration: 0.42, ease: "power2.out", onUpdate: paint })
        // the rule keeps going, past the plate and out to the full width
        .to(rule.current, { scaleX: 1, duration: 0.5, ease: "expo.inOut" }, "<")
        .to(
          plate.current,
          { opacity: 0, y: -14, duration: 0.7, ease: "power2.inOut" },
          "-=0.1",
        )
        .to(
          rule.current,
          { width: "100vw", opacity: 0, duration: 1.1, ease: "expo.inOut" },
          "-=0.5",
        )
        .to(root.current, { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.85")
        // hand off: the form is drawn, then the copy arrives behind it
        .to(S, { heroDraw: 1, duration: 1.9, ease: "power2.inOut" }, "-=0.95")
        .to(S, { intro: 1, duration: 1.25, ease: "power1.out" }, "-=1.35");

      if (reduced) exit.progress(1);
    };

    const started = performance.now();
    Promise.all([fontsReady(), sceneReady()]).then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      gsap.delayedCall(wait / 1000, open);
    });

    return () => {
      creep.kill();
      exit?.kill();
      gsap.killTweensOf(S);
      lenisRef.current?.start();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="cover">
      <div
        ref={plate}
        style={{ display: "grid", justifyItems: "center", gap: "1.5rem" }}
      >
        <span style={{ color: "var(--ash)" }}>
          <Mark size={30} draw />
        </span>
        <p
          className="serif"
          style={{
            margin: 0,
            fontSize: "clamp(1.9rem, 5vw, 3.6rem)",
            letterSpacing: "0.04em",
          }}
        >
          Vessel
        </p>
      </div>

      {/* the rule is the progress bar, and then it is the horizon */}
      <div
        ref={rule}
        style={{
          position: "absolute",
          top: "calc(50% + clamp(84px, 11vh, 132px))",
          left: "50%",
          width: "min(240px, 46vw)",
          height: 1,
          background: "var(--dust)",
        }}
      />

      <div style={{ position: "absolute", left: "var(--gut)", bottom: "var(--gut)" }}>
        <p className="mono mono--dust">
          <span ref={num}>000</span> / 100
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          right: "var(--gut)",
          top: "var(--gut)",
          textAlign: "right",
        }}
      >
        <p className="mono mono--dust">
          Creative &amp; Production
          <br />
          Ahmedabad · Lisbon
        </p>
      </div>
    </div>
  );
}
