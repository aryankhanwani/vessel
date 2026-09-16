"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { EffectComposer, Bloom, SMAA } from "@react-three/postprocessing";
import type * as THREE from "three";
import { S } from "@/lib/state";
import { HeroVessel } from "./three/HeroVessel";
import { Corridor } from "./three/Corridor";
import { Dust } from "./three/Dust";
import { Lighting } from "./three/Stage";
import { Rig } from "./three/Rig";

/** tell the loader the moment there is actually something to reveal */
function ReadySignal() {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      S.sceneReady = true;
    }
  });
  return null;
}

/** widen the lens on tall screens so nothing gets cropped at the lip */
function Responsive() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    cam.fov = aspect < 0.85 ? 56 : aspect < 1.3 ? 44 : 38;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

/** if a machine is clearly struggling, shed the expensive passes — once */
function Governor({ onGiveUp }: { onGiveUp: () => void }) {
  const slow = useRef(0);
  const fired = useRef(false);
  useFrame((_, delta) => {
    if (fired.current) return;
    if (delta > 0.09) slow.current++;
    else slow.current = Math.max(0, slow.current - 1);
    if (slow.current > 45) {
      fired.current = true;
      onGiveUp();
    }
  });
  return null;
}

export function Scene() {
  const [heavy, setHeavy] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeavy(false);
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [-0.72, 0.12, 6.1], fov: 38, near: 0.1, far: 160 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#08080a", 1);
        }}
      >
        <fogExp2 attach="fog" args={["#08080a", 0.05]} />

        <Suspense fallback={null}>
          <Lighting />
          <HeroVessel />
          <Corridor />
          <Dust />
          <Preload all />
        </Suspense>

        <Rig />
        <ReadySignal />
        <Responsive />
        <Governor onGiveUp={() => setHeavy(false)} />
        <AdaptiveDpr pixelated={false} />

        {heavy && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.28}
              luminanceSmoothing={0.5}
              mipmapBlur
              radius={0.72}
            />
            <SMAA />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
