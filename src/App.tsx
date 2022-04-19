import { useState, useRef, useEffect } from "react";
import { Texture, NearestFilter, LinearFilter } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import * as Constants from "./Constant.tsx";
import Model from "./1100.tsx";
import { update, render } from "./Game.tsx";
import * as THREE from "three";
import { updateInstance } from "@react-three/fiber/dist/declarations/src/core/utils";
import { Environment } from "@react-three/drei";

class SnakeBit {
  constructor(x, y) {
    this.position = { x: x, y: y };
  }
}

function App() {


  let game = {
    snake: [
      new SnakeBit(2, 0),
      new SnakeBit(1, 0),
      new SnakeBit(0, 0),
      new SnakeBit(0, 0),
    ],
    direction: Constants.Direction.Right,
    food: undefined,
    restart: false,
  };
  let input = {
    direction: undefined,
  };

  // offscreen canvas
  let canvas = document.createElement("canvas");
  canvas.width = Constants.NOKIA_RESOLUTION.x;
  canvas.height = Constants.NOKIA_RESOLUTION.y;
  let texture = new Texture(canvas);

  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  useEffect(() => {
    function tick() {
      if (game.restart) {
        console.log("restart");
        game.restart = false;
        game.over = false;
        game.food = undefined;
        game.direction = Constants.Direction.Right;
        game.snake = [
          new SnakeBit(2, 0),
          new SnakeBit(1, 0),
          new SnakeBit(0, 0),
          new SnakeBit(0, 0),
        ];
      }
      game = update(game, input);
      render(canvas, game);
      texture.needsUpdate = true;
      setTimeout(
        () => {
          tick();
        },
        game.over ? 90 : 200
      );
    }
    tick();
  }, []);

  function handleKey(event) {
    if (event.keyCode === 65 || event.keyCode === 37) {
      input.direction = Constants.Direction.Left;
    }
    if (event.keyCode === 68 || event.keyCode === 39) {
      input.direction = Constants.Direction.Right;
    }
    if (event.keyCode === 87 || event.keyCode == 38) {
      input.direction = Constants.Direction.Up;
    }
    if (event.keyCode === 83 || event.keyCode == 40) {
      input.direction = Constants.Direction.Down;
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <Canvas>
      <pointLight intensity={0.5} position={[1, 2, 1]}></pointLight>
      <Model scale={1.2} texture={texture} game={game} />
      <Environment background={false} preset={"city"} />
    </Canvas>
  );
}

export default App;
