import { SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import { UI } from "./UI";
import { Experience } from "./components/Experience";
import { AudioMusic } from "./components/AudioMusic";

import { getProject } from "@theatre/core";
import { PerspectiveCamera, SheetProvider } from "@theatre/r3f";
import extension from "@theatre/r3f/dist/extension";
import studio from "@theatre/studio";
import { editable as e } from "@theatre/r3f";
import projectState from "./assets/MedievalTown.theatre-project-state.json";
import audioUrl from "/music/medieval_town_music.mp3";

export const isProduction = import.meta.env.MODE === "production";

if (!isProduction) {
  studio.initialize();
  studio.extend(extension);
}

const project = getProject(
  "MedievalTown",
  isProduction
    ? {
        state: projectState,
      }
    : undefined
);
const mainSheet = project.sheet("Main");
const audio = new Audio(audioUrl);

const transitions = {
  Home: [0, 6],
  Castle: [6, 14 + 24 / 30],
  Windmill: [18, 22 + 15 / 30],
};

function App() {
  const cameraTargetRef = useRef();
  const isSetupRef = useRef(false);
  const [currentScreen, setCurrentScreen] = useState("Intro");
  const [targetScreen, setTargetScreen] = useState("Home");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleAudio = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    project.ready.then(() => {
      if (currentScreen === targetScreen) {
        return;
      }
      if (isSetupRef.current && currentScreen === "Intro") {
        // Strict mode in development will trigger useEffect twice, so we need to check if we did it once
        return;
      }
      isSetupRef.current = true;

      const reverse = targetScreen === "Home" && currentScreen !== "Intro";
      const transition = transitions[reverse ? currentScreen : targetScreen];
      if (!transition) {
        return;
      }
      mainSheet.sequence
        .play({
          range: transition,
          direction: reverse ? "reverse" : "normal",
          rate: reverse ? 2 : 1,
        })
        .then(() => {
          setCurrentScreen(targetScreen);
        });
    });
  }, [targetScreen]);

  return (
    <>
      <UI
        currentScreen={currentScreen}
        onScreenChange={setTargetScreen}
        isAnimating={currentScreen !== targetScreen}
      />

      {/* Audio */}
      <AudioMusic isPlaying={isPlaying} toggleAudio={handleToggleAudio} />

      {/* Canvas */}
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [5, 5, 10], fov: 30, near: 1 }}
        shadows
      >
        <SoftShadows />
        <SheetProvider sheet={mainSheet}>
          <PerspectiveCamera
            position={[5, 5, 10]}
            fov={30}
            near={1}
            makeDefault
            theatreKey="Camera"
            lookAt={cameraTargetRef}
          />
          <e.mesh
            theatreKey="Camera Target"
            visible="editor"
            ref={cameraTargetRef}
          >
            <octahedronGeometry args={[0.1, 0]} />
            <meshPhongMaterial color="hotpink" />
          </e.mesh>
          <Experience isProduction={isProduction} />
        </SheetProvider>
      </Canvas>
    </>
  );
}

export default App;
