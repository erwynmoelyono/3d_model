"use client";
import React, { useRef, useState, useEffect, Fragment, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  useGLTF,
  ContactShadows,
  useTexture,
  Environment,
  OrbitControls,
  Stage,
  useProgress,
  Decal,
} from "@react-three/drei";

import { askAI, readerFile } from "../config/helper";
import { HexColorPicker } from "react-colorful";
import { proxy, ref, useSnapshot } from "valtio";
import { saveAs } from "file-saver";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import {
  Navbar,
  Button,
  FileInput,
  Label,
  Spinner,
  Textarea,
} from "flowbite-react";
import state from "../config/store";
import { Object3D, TextureLoader } from "three";
import { VRButton, ARButton, XR, Controllers, Hands } from "@react-three/xr";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const Customizer = () => {
  const canvasRef = useRef();
  const { active, progress, loaded, total } = useProgress();
  const [model, setModel] = useState("katana.glb");
  const [loadTexture, setLoadTexture] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const textArea = useRef();
  let threeD_model = [];

  function traverseChildren(children) {
    threeD_model = [];
    for (const child of children) {
      if (child.hasOwnProperty("material")) {
        threeD_model.push({
          material: child.material,
          geometry: child.geometry,
        });
      }

      if (child.children && child.children.length > 0) {
        traverseChildren(child.children);
      }
    }
  }

  function handleDeleteSection() {
    state.items[state.current] = "#ffffff";
    state.textures[state.current] = "texture.jpg";
  }
  function handleDefaultModel() {
    threeD_model.forEach((child, index) => {
      state.items[child.material.name] = "#ffffff";
      state.textures[child.material.name] = "texture.jpg";
    });
    state.current = null;
  }

  function handleTextureChange(e) {
    if (e) {
      readerFile(e).then((result) => {
        state.textures[state.current] = result;
      });
    }
  }

  async function handleMessage() {
    try {
      setIsLoading(true);

      await askAI(textArea.current.value).then((value) => {
        state.textures[state.current] = `data:image/png;base64,${value}`;
        setIsLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleDownload() {
    const GLTFexporter = new GLTFExporter();
    const OBJexporter = new OBJExporter();

    GLTFexporter.parse(
      canvasRef.current,
      function (result) {
        saveAs(new Blob([result]), "customized_model.glb");
      },
      function (error) {
        console.log("An error happened");
      },
      {
        binary: true,
      }
    );
    // const result = exporter.parse(canvasRef.current);
    // console.log(result);
    // saveAs(
    //   new Blob([result], { type: "application/octet-stream" }),
    //   "customized_model.obj"
    // );
  }
  function LoadTexture(model) {
    const texture = model ? model : "texture.jpg";
    return useTexture(texture);
  }
  function SwitchModel() {
    setModel("shoe-draco.glb");
    setLoadTexture(true);
  }
  function Model({ model }) {
    const snap = useSnapshot(state);
    const [hovered, set] = useState(null);
    const { scene } = useGLTF(model);

    try {
      if (scene.hasOwnProperty("children")) {
        traverseChildren(scene.children);
        if (loadTexture) {
          handleDefaultModel();
          setLoadTexture(false);
        }
      }
    } catch (error) {
      console.log(error);
    }

    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      canvasRef.current.rotation.set(
        Math.cos(t / 4) / 8,
        Math.sin(t / 4) / 8,
        -0.2 - (1 + Math.sin(t / 1.5)) / 20
      );
      canvasRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
    });

    useEffect(() => {
      const cursor = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><g filter="url(#filter0_d)"><path d="M29.5 47C39.165 47 47 39.165 47 29.5S39.165 12 29.5 12 12 19.835 12 29.5 19.835 47 29.5 47z" fill="${snap.items[hovered]}"/></g><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/><text fill="#000" style="white-space:pre" font-family="Inter var, sans-serif" font-size="10" letter-spacing="-.01em"><tspan x="35" y="63">${hovered}</tspan></text></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h64v64H0z"/></clipPath><filter id="filter0_d" x="6" y="8" width="47" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="3"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>`;
      const auto = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="rgba(255, 255, 255, 0.5)" d="M29.5 54C43.031 54 54 43.031 54 29.5S43.031 5 29.5 5 5 15.969 5 29.5 15.969 54 29.5 54z" stroke="#000"/><path d="M2 2l11 2.947L4.947 13 2 2z" fill="#000"/></svg>`;
      if (hovered) {
        document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
          cursor
        )}'), auto`;
        return () =>
          (document.body.style.cursor = `url('data:image/svg+xml;base64,${btoa(
            auto
          )}'), auto`);
      }
    }, [hovered]);

    return (
      <group
        ref={canvasRef}
        onPointerOver={(e) => (
          e.stopPropagation(), set(e.object.material.name)
        )}
        onPointerOut={(e) => e.intersections.length === 0 && set(null)}
        onPointerMissed={() => (state.current = null)}
        onClick={(e) => (
          e.stopPropagation(), (state.current = e.object.material.name)
        )}
        scale={[1, 1, 1]}
      >
        {threeD_model.map((child, index) => (
          <mesh
            key={index}
            receiveShadow
            castShadow
            geometry={child.geometry}
            material={child.material}
            material-color={
              snap.items[child.material.name]
                ? snap.items[child.material.name]
                : "#ffffff"
            }
            material-map={LoadTexture(snap.textures[child.material.name])}
          />
        ))}
      </group>
    );
  }

  function Picker() {
    const snap = useSnapshot(state);

    return (
      <div>
        <div
          className={`${
            snap.current ? "inline" : "hidden"
          } w-full h-auto text-center flex md:flex-row flex-col justify-center place-self-center items-center`}
        >
          <h1 className="text-5xl capitalize ">{snap.current}</h1>
          <HexColorPicker
            style={{ width: 100, height: 100 }}
            color={snap.items[snap.current]}
            onChange={(color) => (state.items[snap.current] = color)}
          />
          <Button.Group>
            <Button color="gray" onClick={() => handleDeleteSection()}>
              Delete Section
            </Button>
            <Button color="gray" onClick={() => handleDefaultModel()}>
              Delete All
            </Button>
            <Button color="gray" onClick={() => SwitchModel()}>
              Change Model
            </Button>
          </Button.Group>
        </div>

        <div
          className={`${
            snap.current ? "inline" : "hidden"
          } w-full h-auto text-center flex md:flex-row flex-col justify-center place-self-center items-center`}
        >
          <Button onClick={() => handleDownload()}>
            Download Customized Model
          </Button>

          <div id="fileUpload">
            <div className="mb-2 block">
              <Label htmlFor="file" value="Upload file" />
            </div>
            <FileInput
              id="file"
              helperText="A profile picture is useful to confirm your are logged into your account"
              accept="image/*"
              onChange={(e) => handleTextureChange(e.target.files[0])}
            />
          </div>
        </div>
        <div
          className={`${
            snap.current ? "inline" : "hidden"
          } w-full h-auto text-center flex md:flex-row flex-col justify-center place-self-center items-center`}
        >
          <div id="textarea">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea
              ref={textArea}
              id="comment"
              placeholder="Leave a comment..."
              required={true}
              rows={4}
            />
            <Button type="submit" onClick={() => handleMessage()}>
              Ask AI
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full md:h-[1000px] ">
      <Fragment>
        <div
          className={`${
            progress >= 100 || isLoading
              ? "hidden"
              : "flex items-center justify-center h-screen"
          }`}
        >
          <Spinner
            aria-label="Center-aligned spinner example"
            className="w-[100px] h-[100px]"
          />
        </div>

        <Picker />
        <ARButton />
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
          <XR>
            <Controllers />
            <Hands />

            <ambientLight intensity={0.7} />
            <spotLight
              intensity={0.5}
              angle={0.1}
              penumbra={1}
              position={[10, 15, 10]}
              castShadow
            />

            <Model model={model} />

            <Environment preset="city" />
            <ContactShadows
              position={[0, -0.8, 0]}
              opacity={0.25}
              scale={10}
              blur={1.5}
              far={0.8}
            />
            <OrbitControls
              minPolarAngle={0} // Allows rotation below the horizon
              maxPolarAngle={Math.PI} // Allows rotation above the horizon
              enableZoom={true}
              rotateSpeed={1}
              enableRotate={true}
            />
          </XR>
        </Canvas>
      </Fragment>
    </div>
  );
};
