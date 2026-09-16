"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { S } from "@/lib/state";

const COUNT = 900;

/** a soft dot, drawn at runtime — no image assets anywhere in this build */
function dotTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

/** Studio air. Barely there, but the room reads as a room because of it. */
export function Dust() {
  const kit = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 1;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      size: 0.022,
      sizeAttenuation: true,
      color: new THREE.Color("#e9e3d7"),
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      map: dotTexture(),
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    return { points, positions, seeds, geometry };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const { positions, seeds, geometry } = kit;
    // drift up slowly, and get shoved along by scroll
    const push = S.vel * 0.0016;
    for (let i = 0; i < COUNT; i++) {
      const k = i * 3;
      positions[k + 1] += dt * 0.035 + push;
      positions[k] += Math.sin(t * 0.18 + seeds[i]) * 0.0007;
      if (positions[k + 1] > 3.5) positions[k + 1] = -3.5;
      if (positions[k + 1] < -3.5) positions[k + 1] = 3.5;
    }
    geometry.attributes.position.needsUpdate = true;
    kit.points.rotation.y = S.pointer.x * 0.04;
  });

  return <primitive object={kit.points} />;
}
