"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { lenisRef } from "@/lib/lenis";
import { S } from "@/lib/state";

/** A held black frame, a count, then the lid comes off. */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    lenisRef.current?.stop();

    const count = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        S.ready = true;
        lenisRef.current?.start();
        setGone(true);
      },
    });

    tl.to(count, {
      v: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (num.current) {
          num.current.textContent = String(Math.round(count.v)).padStart(3, "0");
        }
      },
    })
      .to(root.current, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.2")
      .to(
        root.current,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        "-=0.7",
      );

    return () => {
      tl.kill();
      lenisRef.current?.start();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="cover">
      <div
        style={{
          position: "absolute",
          left: "var(--gut)",
          bottom: "var(--gut)",
        }}
      >
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
      <p
        className="serif"
        style={{
          margin: 0,
          fontSize: "clamp(2rem, 6vw, 4.6rem)",
          letterSpacing: "0.02em",
        }}
      >
        Vessel
      </p>
    </div>
  );
}
