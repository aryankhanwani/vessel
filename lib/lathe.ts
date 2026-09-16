import * as THREE from "three";

/**
 * A hand-rolled LatheGeometry.
 *
 * three's own LatheGeometry rebuilds every buffer whenever the profile or the
 * sweep angle changes — far too costly to do on a scroll frame. This allocates
 * once and rewrites positions and normals in place, so the form can morph
 * between silhouettes *and* unfurl around its axis at 60fps.
 */
export interface LatheHandle {
  geometry: THREE.BufferGeometry;
  segments: number;
  res: number;
}

export function createLathe(res: number, segments: number): LatheHandle {
  const vertexCount = (segments + 1) * res;
  const position = new Float32Array(vertexCount * 3);
  const normal = new Float32Array(vertexCount * 3);
  const uv = new Float32Array(vertexCount * 2);

  const indices: number[] = [];
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < res - 1; j++) {
      const base = j + i * res;
      const a = base;
      const b = base + res;
      const c = base + res + 1;
      const d = base + 1;
      indices.push(a, b, d, c, d, b);
    }
  }

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j < res; j++) {
      const k = (i * res + j) * 2;
      uv[k] = i / segments;
      uv[k + 1] = j / (res - 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.2);

  return { geometry, segments, res };
}

const tangent = new THREE.Vector2();

/**
 * Rewrite the surface for a given profile and sweep.
 * Normals come from the 2D profile tangent rotated around Y — exact, and far
 * cheaper than computeVertexNormals().
 */
export function updateLathe(
  handle: LatheHandle,
  pts: THREE.Vector2[],
  phiStart: number,
  phiLength: number,
) {
  const { geometry, segments, res } = handle;
  const pos = geometry.attributes.position.array as Float32Array;
  const nor = geometry.attributes.normal.array as Float32Array;

  // profile-space normals, computed once per frame rather than per segment
  const nx = new Array<number>(res);
  const ny = new Array<number>(res);
  for (let j = 0; j < res; j++) {
    const prev = pts[Math.max(j - 1, 0)];
    const next = pts[Math.min(j + 1, res - 1)];
    tangent.set(next.x - prev.x, next.y - prev.y);
    if (tangent.lengthSq() < 1e-12) tangent.set(0, 1);
    tangent.normalize();
    nx[j] = tangent.y;
    ny[j] = -tangent.x;
  }

  for (let i = 0; i <= segments; i++) {
    const phi = phiStart + (i / segments) * phiLength;
    const s = Math.sin(phi);
    const c = Math.cos(phi);
    for (let j = 0; j < res; j++) {
      const k = (i * res + j) * 3;
      const p = pts[j];
      pos[k] = p.x * s;
      pos[k + 1] = p.y;
      pos[k + 2] = p.x * c;
      nor[k] = nx[j] * s;
      nor[k + 1] = ny[j];
      nor[k + 2] = nx[j] * c;
    }
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

/** a plain static lathe for scenery that never morphs */
export function staticLathe(pts: THREE.Vector2[], segments = 64) {
  return new THREE.LatheGeometry(pts, segments);
}

/* ---------------------------------------------------------- line helpers -- */

/** an editable polyline living in the XY plane */
export function createProfileLine(res: number, color: THREE.ColorRepresentation) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(res * 3), 3),
  );
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.2);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  return new THREE.Line(geometry, material);
}

export function updateProfileLine(line: THREE.Line, pts: THREE.Vector2[]) {
  const arr = line.geometry.attributes.position.array as Float32Array;
  for (let j = 0; j < pts.length; j++) {
    arr[j * 3] = pts[j].x;
    arr[j * 3 + 1] = pts[j].y;
    arr[j * 3 + 2] = 0;
  }
  line.geometry.attributes.position.needsUpdate = true;
}

/** a horizontal guide ring whose radius tracks the profile at height index j */
export function createRing(points = 96, color: THREE.ColorRepresentation) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array((points + 1) * 3), 3),
  );
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2.2);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const line = new THREE.Line(geometry, material);
  line.userData.points = points;
  return line;
}

export function updateRing(
  line: THREE.Line,
  radius: number,
  y: number,
  phiStart: number,
  phiLength: number,
) {
  const points = line.userData.points as number;
  const arr = line.geometry.attributes.position.array as Float32Array;
  for (let i = 0; i <= points; i++) {
    const phi = phiStart + (i / points) * phiLength;
    arr[i * 3] = Math.sin(phi) * radius;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = Math.cos(phi) * radius;
  }
  line.geometry.attributes.position.needsUpdate = true;
}
