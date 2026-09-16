"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ACTS, type ActId } from "@/lib/acts";
import { S, damp, easeInOut, lerp } from "@/lib/state";

type Vec3 = [number, number, number];
interface Shot {
  from: Vec3;
  to: Vec3;
  lookFrom: Vec3;
  lookTo: Vec3;
  /** optional custom path, used where a straight line would be boring */
  orbit?: boolean;
}

/**
 * One continuous camera move, cut into shots. Each act owns one shot and the
 * ends are authored to meet, so the whole page is a single take.
 */
const SHOTS: Record<ActId, Shot> = {
  threshold: {
    from: [-0.72, 0.12, 6.1],
    to: [-0.55, 0.06, 5.15],
    lookFrom: [-0.72, 0.06, 0],
    lookTo: [-0.55, 0.02, 0],
  },
  turning: {
    from: [-0.55, 0.06, 5.15],
    to: [0, 0, 3.85],
    lookFrom: [-0.55, 0.02, 0],
    lookTo: [0, 0, 0],
  },
  index: {
    from: [0, 0, 3.85],
    to: [0.83, 0.14, 4.55],
    lookFrom: [0, 0, 0],
    lookTo: [0.5, 0.02, 0],
  },
  works: {
    // a slow arc around the form, radius closing in
    from: [0.18, 4.62, 0],
    to: [1.05, 4.15, 0],
    lookFrom: [0.5, 0.02, 0],
    lookTo: [0, 0, 0],
    orbit: true,
  },
  corridor: {
    from: [3.59, 0.14, 2.06],
    to: [0, 0.06, 4.1],
    lookFrom: [0, 0, 0],
    lookTo: [0, 0, 0],
  },
  manifesto: {
    from: [0, 0.06, 4.1],
    to: [-0.5, 0.12, 11.2],
    lookFrom: [0, 0, 0],
    lookTo: [-0.5, 0.62, 0],
  },
  signoff: {
    from: [-0.5, 0.12, 11.2],
    to: [0.18, -0.12, 3.15],
    lookFrom: [0, 0.05, 0],
    lookTo: [0, -0.06, 0],
  },
};

const IDS = ACTS.map((a) => a.id);

export function Rig() {
  const { camera, size } = useThree();
  const target = useRef(new THREE.Vector3(-0.72, 0.12, 6.1));
  const look = useRef(new THREE.Vector3(-0.72, 0.06, 0));
  const smoothLook = useRef(new THREE.Vector3(-0.72, 0.06, 0));

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    // a shot framed for a wide screen puts the form off the edge of a narrow
    // one — pull every sideways offset in proportion to the viewport
    const lateral = Math.min(1, Math.max(0.3, size.width / size.height / 1.78));

    // the live act is the last one that has begun
    let idx = 0;
    for (let k = 0; k < IDS.length; k++) if (S.acts[IDS[k]] > 0) idx = k;
    const local = S.acts[IDS[idx]];
    const shot = SHOTS[IDS[idx]];
    const e = easeInOut(local);

    if (shot.orbit) {
      const angle = lerp(shot.from[0], shot.to[0], e);
      const radius = lerp(shot.from[1], shot.to[1], e);
      target.current.set(
        Math.sin(angle) * radius,
        0.14 + Math.sin(e * Math.PI) * 0.34,
        Math.cos(angle) * radius,
      );
    } else {
      target.current.set(
        lerp(shot.from[0], shot.to[0], e),
        lerp(shot.from[1], shot.to[1], e),
        lerp(shot.from[2], shot.to[2], e),
      );
    }

    target.current.x *= lateral;

    look.current.set(
      lerp(shot.lookFrom[0], shot.lookTo[0], e) * lateral,
      lerp(shot.lookFrom[1], shot.lookTo[1], e),
      lerp(shot.lookFrom[2], shot.lookTo[2], e),
    );

    // hand-held: the lens drifts with the pointer and breathes on its own
    const t = performance.now() * 0.00016;
    camera.position.x = damp(
      camera.position.x,
      target.current.x + S.pointer.x * 0.26 * lateral + Math.sin(t) * 0.03,
      3.4,
      dt,
    );
    camera.position.y = damp(
      camera.position.y,
      target.current.y - S.pointer.y * 0.14 + Math.cos(t * 1.3) * 0.02,
      3.4,
      dt,
    );
    camera.position.z = damp(camera.position.z, target.current.z, 3.4, dt);

    smoothLook.current.x = damp(smoothLook.current.x, look.current.x, 3.2, dt);
    smoothLook.current.y = damp(smoothLook.current.y, look.current.y, 3.2, dt);
    smoothLook.current.z = damp(smoothLook.current.z, look.current.z, 3.2, dt);
    camera.lookAt(smoothLook.current);
  });

  return null;
}
