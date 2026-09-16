"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createLathe,
  updateLathe,
  createProfileLine,
  updateProfileLine,
  createRing,
  updateRing,
} from "@/lib/lathe";
import {
  HERO_SEQUENCE,
  PROFILE_RES,
  mixProfiles,
  profile,
  scratchProfile,
} from "@/lib/profiles";
import { S, clamp, damp, easeInOut, smoothRange } from "@/lib/state";

const TAU = Math.PI * 2;
const SEGMENTS = 96;

/** where the hero form sits in the sequence of silhouettes, given the acts */
function heroSeq(): number {
  const A = S.acts;
  const seq =
    easeInOut(A.index) * 2 +
    easeInOut(A.works) * 2 +
    easeInOut(A.manifesto) * 1.4 +
    easeInOut(A.signoff) * 1.6;
  return clamp(seq, 0, HERO_SEQUENCE.length - 1.001);
}

export function HeroVessel() {
  const spin = useRef(0);
  const smoothOpacity = useRef(0);
  const scratch = useMemo(scratchProfile, []);

  const kit = useMemo(() => {
    const group = new THREE.Group();

    const lathe = createLathe(PROFILE_RES, SEGMENTS);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#121317"),
      roughness: 0.34,
      metalness: 0.28,
      clearcoat: 0.85,
      clearcoatRoughness: 0.42,
      envMapIntensity: 1.15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(lathe.geometry, material);
    mesh.castShadow = false;
    group.add(mesh);

    // the drawn silhouette — one line per open edge of the sweep,
    // plus a mirrored ghost that only exists before the form is turned
    const edgeA = createProfileLine(PROFILE_RES, "#e9e3d7");
    const edgeB = createProfileLine(PROFILE_RES, "#e9e3d7");
    const ghost = createProfileLine(PROFILE_RES, "#e9e3d7");
    ghost.rotation.y = Math.PI;
    group.add(edgeA, edgeB, ghost);

    // the axis the whole studio turns around
    const axisGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -1.45, 0),
      new THREE.Vector3(0, 1.45, 0),
    ]);
    const axis = new THREE.Line(
      axisGeom,
      new THREE.LineDashedMaterial({
        color: "#4a463f",
        dashSize: 0.045,
        gapSize: 0.045,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    );
    axis.computeLineDistances();
    group.add(axis);

    const rings = [createRing(96, "#b85c38"), createRing(96, "#4a463f"), createRing(96, "#4a463f")];
    group.add(...rings);

    return { group, lathe, mesh, material, edgeA, edgeB, ghost, axis, rings };
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const A = S.acts;
    const { lathe, material, edgeA, edgeB, ghost, axis, rings } = kit;

    /* ---------------------------------------------------- silhouette ---- */
    const seq = heroSeq();
    const i = Math.floor(seq);
    const t = seq - i;
    const swell = clamp(Math.abs(S.vel) * 0.0035, 0, 0.05);
    mixProfiles(
      profile(HERO_SEQUENCE[i]),
      profile(HERO_SEQUENCE[Math.min(i + 1, HERO_SEQUENCE.length - 1)]),
      t * t * (3 - 2 * t),
      scratch,
      swell,
    );

    /* --------------------------------------------------------- sweep ---- */
    // turned open across act 01, closed again as the page signs off
    const opened = smoothRange(A.turning, 0.1, 0.72);
    const closed = smoothRange(A.signoff, 0.2, 0.74);
    const sweep = clamp(opened - closed);
    const phiLength = sweep * TAU;
    const phiStart = -phiLength / 2;

    updateLathe(lathe, scratch, phiStart, phiLength);

    /* ----------------------------------------------------- presences ---- */
    // the surface only exists once it has been turned
    const born = smoothRange(A.turning, 0.08, 0.34);
    const away = smoothRange(A.corridor, 0.04, 0.3); // stands aside for the corridor
    const back = smoothRange(A.manifesto, 0.0, 0.26); // and returns, far off, for the manifesto
    const bodyTarget = born * clamp(1 - away + back);
    smoothOpacity.current = damp(smoothOpacity.current, bodyTarget, 7, dt);
    material.opacity = smoothOpacity.current;
    material.transparent = smoothOpacity.current < 0.995;
    kit.mesh.visible = smoothOpacity.current > 0.004;

    // drawing in: the profile is literally drawn before anything is turned
    // a hand is already partway through the drawing when you arrive
    const drawn = 0.1 + 0.9 * smoothRange(A.threshold, 0.0, 0.4);
    const drawCount = Math.max(2, Math.round(drawn * PROFILE_RES));
    updateProfileLine(edgeA, scratch);
    updateProfileLine(edgeB, scratch);
    updateProfileLine(ghost, scratch);
    edgeA.geometry.setDrawRange(0, drawCount);
    ghost.geometry.setDrawRange(0, drawCount);

    const lineFade = 1 - smoothRange(A.turning, 0.62, 0.9);
    const lineBack = smoothRange(A.signoff, 0.34, 0.78) * (1 - smoothRange(A.signoff, 0.9, 1));
    const lineOpacity = Math.max(drawn * lineFade, lineBack);

    (edgeA.material as THREE.LineBasicMaterial).opacity = lineOpacity;
    (edgeB.material as THREE.LineBasicMaterial).opacity = lineOpacity * sweep;
    (ghost.material as THREE.LineBasicMaterial).opacity =
      lineOpacity * (1 - smoothRange(A.turning, 0.02, 0.24));

    edgeA.rotation.y = phiStart;
    edgeB.rotation.y = phiStart + phiLength;
    ghost.rotation.y = Math.PI + phiStart * 0.35;

    (axis.material as THREE.LineDashedMaterial).opacity =
      0.85 * Math.max(drawn * (1 - smoothRange(A.turning, 0.7, 0.95)), lineBack * 0.8);

    // guide rings: lip, waist, foot — they track the live silhouette
    const marks = [PROFILE_RES - 5, Math.floor(PROFILE_RES * 0.46), 4];
    const ringOn =
      smoothRange(A.turning, 0.02, 0.18) * (1 - smoothRange(A.turning, 0.74, 0.96));
    rings.forEach((ring, k) => {
      const p = scratch[marks[k]];
      updateRing(ring, p.x, p.y, phiStart, Math.max(phiLength, 0.001));
      (ring.material as THREE.LineBasicMaterial).opacity =
        ringOn * (k === 0 ? 0.9 : 0.45);
      ring.visible = ringOn > 0.01;
    });

    /* -------------------------------------------------------- motion ---- */
    spin.current += dt * (0.075 + Math.abs(S.vel) * 0.0012);
    const g = kit.group;
    g.rotation.y = spin.current + S.pointer.x * 0.08;
    g.rotation.x = damp(g.rotation.x, S.pointer.y * 0.045, 4, dt);
    g.position.y = damp(
      g.position.y,
      -0.06 + Math.sin(spin.current * 0.6) * 0.015,
      3,
      dt,
    );
  });

  return <primitive object={kit.group} />;
}
