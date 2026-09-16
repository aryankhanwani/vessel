"use client";

import dynamic from "next/dynamic";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Hud } from "@/components/Hud";
import { Intro } from "@/components/Intro";
import { Threshold } from "@/components/acts/Threshold";
import { Turning } from "@/components/acts/Turning";
import { Index } from "@/components/acts/Index";
import { Works } from "@/components/acts/Works";
import { CorridorAct } from "@/components/acts/Corridor";
import { Manifesto } from "@/components/acts/Manifesto";
import { Signoff } from "@/components/acts/Signoff";

// WebGL never renders on the server
const Scene = dynamic(() => import("@/components/Scene").then((m) => m.Scene), {
  ssr: false,
});

/**
 * One page, one take. Seven acts of scroll over a single held WebGL frame —
 * no header, no footer, nothing that repeats.
 */
export default function Page() {
  return (
    <SmoothScroll>
      <Scene />

      <main style={{ position: "relative", zIndex: 1 }}>
        <Threshold />
        <Turning />
        <Index />
        <Works />
        <CorridorAct />
        <Manifesto />
        <Signoff />
      </main>

      <Hud />
      <div className="overlay" />
      <Intro />
    </SmoothScroll>
  );
}
