"use client";
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";

export const VR = () => {
  return (
    <>
      <ARButton />
      <Canvas>
        <XR foveation={0} frameRate={120}>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
          <Controllers />
          <Environment preset="city" />
          <OrbitControls />
          <ambientLight intensity={0.6} />
          <directionalLight intensity={0.5} />
        </XR>
      </Canvas>
    </>
  );
};
