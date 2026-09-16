"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { profile, type ProfileId } from "@/lib/profiles";
import { staticLathe } from "@/lib/lathe";
import { S, clamp, smoothRange } from "@/lib/state";

const KINDS: ProfileId[] = [
  "amphora",
  "column",
  "obelisk",
  "chalice",
  "totem",
  "column",
  "amphora",
  "obelisk",
  "bowl",
  "column",
  "chalice",
  "totem",
  "amphora",
  "obelisk",
];

/** length of the loop, and how far past the lens a form may travel */
const FIELD = 60;
const NEAR = 6;

/** deterministic noise so the corridor is the same every visit */
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Act 04. A held archive of turned forms. The camera never moves — the corridor
 * is pulled through it, which keeps every other act's framing intact.
 */
export function Corridor() {
  const kit = useMemo(() => {
    const group = new THREE.Group();
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0e0f12"),
      roughness: 0.42,
      metalness: 0.22,
      clearcoat: 0.6,
      clearcoatRoughness: 0.5,
      envMapIntensity: 1.25,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });

    const geoms: THREE.BufferGeometry[] = [];
    KINDS.forEach((kind, i) => {
      const geom = staticLathe(profile(kind), 56);
      geoms.push(geom);
      const mesh = new THREE.Mesh(geom, material);
      const side = i % 2 === 0 ? -1 : 1;
      mesh.position.set(
        side * (0.8 + rnd(i) * 2.3),
        -1.6 + rnd(i + 40) * 2.9,
        0,
      );
      const s = 0.4 + rnd(i + 17) * 1.05;
      mesh.scale.setScalar(s);
      mesh.rotation.y = rnd(i + 5) * Math.PI * 2;
      mesh.userData.spin = (rnd(i + 23) - 0.5) * 0.14;
      // where this form sits along the loop
      mesh.userData.z = -(i / KINDS.length) * FIELD - rnd(i + 31) * 2.4;
      group.add(mesh);
    });

    group.visible = false;
    return { group, material, geoms };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const p = S.acts.corridor;
    const fade =
      smoothRange(p, 0.0, 0.14) * (1 - smoothRange(p, 0.86, 1)) * 0.98;

    kit.group.visible = fade > 0.01;
    if (!kit.group.visible) return;

    kit.material.opacity = fade;
    kit.group.position.x = S.pointer.x * 0.22;
    kit.group.rotation.y = S.pointer.x * 0.02;

    // the archive is endless: anything that passes the lens is put back at the
    // far end of the loop, so the density never thins out mid-act
    const travel = clamp(p) * FIELD * 2.8;
    for (const child of kit.group.children) {
      const z = (child.userData.z as number) + travel;
      child.position.z = (((z - NEAR) % FIELD) + FIELD) % FIELD + NEAR - FIELD;
      child.rotation.y += dt * (child.userData.spin as number);
    }
  });

  return <primitive object={kit.group} />;
}
