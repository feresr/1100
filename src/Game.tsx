import { drawRect } from "./Graphics.js";
import * as c from "./Constant.tsx";
import { opposite } from "./Constant";
import { drawDot, drawPatternRect } from "./Graphics";

const mod = (n, m) => ((n % m) + m) % m;
const foodAudio = new Audio("./pickupCoin.wav");
const snakeAudio = new Audio("./hitHurt.wav");

export function render(canvas, game) {
  let context = canvas.getContext("2d", { antialias: false });

  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ACD503FF";
  context.fill();

  const id = context.getImageData(
    0,
    0,
    c.NOKIA_RESOLUTION.x,
    c.NOKIA_RESOLUTION.y
  );
  // draw border
  drawRect(
    id,
    5,
    12,
    c.NOKIA_RESOLUTION.x - 10,
    c.NOKIA_RESOLUTION.y - 18,
    0x009900ff
  );
  drawRect(
    id,
    6,
    13,
    c.NOKIA_RESOLUTION.x - 12,
    c.NOKIA_RESOLUTION.y - 20,
    0x00ff00ff
  );

  for (let i = 0; i < game.snake.length; i++) {
    const bit = game.snake[i];
    if (i == 0) {
      drawPatternRect(
        id,
        bit.position.x * 4 + 7,
        bit.position.y * 4 + 14,
        4,
        4,
        0x009900ff,
        [0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0]
      );
    } else {
      drawPatternRect(
        id,
        bit.position.x * 4 + 7,
        bit.position.y * 4 + 14,
        4,
        4,
        0x009900ff,
        [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1]
      );
    }
  }

  //draw food
  drawPatternRect(
    id,
    game.food.x * 4 + 7,
    game.food.y * 4 + 14,
    4,
    4,
    0x009900ff,
    [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0]
  );

  //draw food menu (top)
  for (let i = 0; i < game.snake.length - 5; i++) {
    drawPatternRect(
      id,
      7 + i * 4,
      4 + 2,
      4,
      4,
      0x009900ff,
      [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0]
    );
  }

  context.putImageData(id, 0, 0);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function update(game, input) {
  if (game.over) {
    if (game.snake.length > 1) {
      game.snake.pop();
    } else {
      game.restart = true;
    }
    return game;
  }
  let direction = input.direction;

  if (direction == undefined || opposite(game.direction, input.direction)) {
    // can't go back, continue in the same direction
    direction = game.direction;
  }

  // update tail (this is a bit naive, I cuold just move the tail to where the head currently is, but who cares)
  for (let i = game.snake.length - 1; i > 0; i--) {
    game.snake[i].position.x = game.snake[i - 1].position.x;
    game.snake[i].position.y = game.snake[i - 1].position.y;
  }

  // update head
  switch (direction) {
    case c.Direction.Right:
      game.snake[0].position.x += 1;
      break;
    case c.Direction.Left:
      game.snake[0].position.x -= 1;
      break;
    case c.Direction.Up: {
      game.snake[0].position.y -= 1;
      break;
    }
    case c.Direction.Down: {
      game.snake[0].position.y += 1;
      break;
    }
  }

  // make sure head stays in the map
  const snakeHead = game.snake[0];
  snakeHead.position.x = mod(game.snake[0].position.x, 21);
  snakeHead.position.y = mod(game.snake[0].position.y, 11);

  // check if the snake bit its tail (game over)
  for (let i = game.snake.length - 1; i > 0; i--) {
    if (
      game.snake[0].position.x == game.snake[i].position.x &&
      game.snake[0].position.y == game.snake[i].position.y
    ) {
      console.log("game over");
      game.over = true;
      snakeAudio.pause();
      snakeAudio.play();
    }
  }

  // eat food
  if (
    game.food &&
    snakeHead.position.x == game.food.x &&
    snakeHead.position.y == game.food.y
  ) {
    game.food = undefined;
    foodAudio.play();
  } else {
  }

  if (game.food == undefined) {
    game.food = {
      x: getRandomInt(21),
      y: getRandomInt(11),
    };
    game.snake.push({
      position: { x: snakeHead.position.x, y: snakeHead.position.y },
    });
  }

  // update game direction (for next frame)
  game.direction = direction;
  return game;
}
