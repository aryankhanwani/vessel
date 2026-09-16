"use client";

import { Environment, Lightformer, MeshReflectorMaterial } from "@react-three/drei";

/**
 * The room. A cold key wall on the left, an oxidised ember rim on the right,
 * and a wet dark floor. All light is local — no HDRIs are fetched.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.22} color="#9aa2ab" />
      <directionalLight
        position={[-4, 5, 3]}
        intensity={0.55}
        color="#cfd6de"
      />
      <pointLight position={[3.2, 0.4, 1.6]} intensity={2.2} color="#b85c38" distance={9} decay={2} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#050506"]} />
        <Lightformer
          form="rect"
          intensity={3.3}
          color="#d6dde6"
          scale={[7, 12, 1]}
          position={[-6, 2, -1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.35}
          color="#b85c38"
          scale={[5, 9, 1]}
          position={[6, 0.5, -1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer
          form="circle"
          intensity={1.1}
          color="#e9e3d7"
          scale={4}
          position={[0, 6, -4]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color="#6f7a63"
          scale={[8, 3, 1]}
          position={[0, -3, 4]}
          rotation-x={-Math.PI / 2}
        />
      </Environment>
    </>
  );
}

export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-1.06}>
      <planeGeometry args={[70, 70]} />
      <MeshReflectorMaterial
        resolution={512}
        mixBlur={1}
        mixStrength={2.4}
        blur={[420, 140]}
        mirror={0.34}
        depthScale={1.1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.3}
        color="#08080a"
        metalness={0.7}
        roughness={0.92}
      />
    </mesh>
  );
}
