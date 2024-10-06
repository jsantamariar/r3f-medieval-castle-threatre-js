import { useRef } from "react";
import { Environment } from "@react-three/drei";
import { MedievalFantasyBook } from "./MedievalFantasyBook";
import { editable as e } from "@theatre/r3f";
import { EffectComposer, Autofocus } from "@react-three/postprocessing";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export const Experience = ({ isProduction, ...props }) => {
  const focusTargetRef = useRef(new Vector3(0, 0, 0));
  const focusTargetVisualizerRef = useRef();

  useFrame(({ camera }) => {
    if (focusTargetVisualizerRef.current) {
      focusTargetRef.current.copy(focusTargetVisualizerRef.current.position);
    }
  }, []);

  return (
    <>
      <e.directionalLight
        theatreKey="SunLight"
        position={[3, 3, 3]}
        intensity={0.2}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <e.group theatreKey="MedievalFantasyBook">
        <MedievalFantasyBook scale={0.1} envMapIntensity={0.3} />
      </e.group>
      <Environment preset="dawn" background blur={4} />
      <e.mesh
        theatreKey="FocusTarget"
        ref={focusTargetVisualizerRef}
        visible="editor"
      >
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="hotpink" wireframe />
      </e.mesh>
      <EffectComposer>
        <Autofocus
          smoothTime={0.1}
          debug={isProduction ? undefined : 0.04}
          focusRange={0.002}
          bokehScale={8}
          target={focusTargetRef.current}
        />
      </EffectComposer>
    </>
  );
};
