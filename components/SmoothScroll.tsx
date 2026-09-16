"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { S, damp } from "@/lib/state";
import { lenisRef } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis drives the window scroll; ScrollTrigger is told to update from the same
 * tick so pinning and smoothing never disagree. Scroll position and pointer are
 * mirrored into the shared scene state for the WebGL layer to read.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const lenis = new Lenis({
      duration: 1.25,
      lerp: reduced ? 1 : 0.085,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      smoothWheel: !reduced,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenisRef.current = lenis;
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    let smoothVel = 0;

    lenis.on("scroll", (e: { progress: number; velocity: number }) => {
      S.p = e.progress;
      smoothVel = e.velocity;
      ScrollTrigger.update();
    });

    // one clock for everything — gsap's ticker
    const tick = (time: number, delta: number) => {
      lenis.raf(time * 1000);
      const dt = Math.min(delta / 1000, 1 / 30);
      S.vel = damp(S.vel, smoothVel, 9, dt);
      smoothVel *= 0.92;
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      S.pointer.x = x;
      S.pointer.y = y;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 400);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
