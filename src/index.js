import { loadImage, loadJson } from "./Loaders.js";
import Spritesheet from "./Spritesheet.js";
import Player from "./entities/Player.js";
import Entity from "./Entity.js";
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const scale = window.devicePixelRatio || 1;

canvas.setAttribute("style", `width:${canvas.getAttribute("width")}; height:${canvas.getAttribute("height")}`);
canvas.width = canvas.getAttribute("width") * scale;
canvas.height = canvas.getAttribute("height") * scale;
context.scale(scale, scale);

const buildTileMatrix = level => {
  const tileMatrix = [];
  level.layers.forEach(layer => {
    const [top, left, bottom, right] = layer.coords;
    for (let y = top; y < bottom; y++) {
      for (let x = left; x < right; x++) {
        if (!Array.isArray(tileMatrix[y])) {
          tileMatrix[y] = [];
        }
        tileMatrix[y][x] = layer;
      }
    }
  });
  return tileMatrix;
};

const renderBg = (tileMatrix, spritesheet) => {
  tileMatrix.forEach((row, rowIndex) => {
    row.forEach((column, colIndex) => {
      spritesheet.draw(column.tile, context, colIndex * 16, rowIndex * 16);
    });
  });
};

const main = async () => {
  const level = await loadJson("src/levels/01.json");
  const tileset = await loadJson(level.tileset);
  const spriteImage = await loadImage(tileset);
  const spritesheet = new Spritesheet(spriteImage, tileset.size[0], tileset.size[1]);
  const entities = [];

  tileset.tiles.forEach(tile => {
    spritesheet.define(tile.name, tile.tile[0], tile.tile[1]);
  });
  spritesheet.define("player", 8, 3);
  const player = new Player(
    "player",
    {
      x: 64,
      y: 64
    },
    spritesheet
  );

  entities.push(player);
  const tileMatrix = buildTileMatrix(level);

  level.entities.forEach(entity => {
    entities.push(new Entity(entity.tile, { x: entity.coords[0], y: entity.coords[1] }, spritesheet));
  });

  window.addEventListener("keydown", e => {
    const movement = 8;
    const playerSize = 12;
    const by16 = coord => Math.floor(coord / 16);
    const prevPos = {};
    Object.assign(prevPos, player.pos);
    if (e.key === "ArrowRight") {
      player.pos.x += movement;
      player.direction.x = 0;
    } else if (e.key === "ArrowLeft") {
      player.pos.x -= movement;
      player.direction.x = 1;
    } else if (e.key === "ArrowUp") {
      player.pos.y -= movement;
    } else if (e.key === "ArrowDown") {
      player.pos.y += movement;
    }

    // collision check
    if (
      tileMatrix[by16(player.pos.y + playerSize)][by16(player.pos.x + playerSize)].solid === true ||
      tileMatrix[by16(player.pos.y + playerSize)][by16(player.pos.x)].solid === true ||
      tileMatrix[by16(player.pos.y)][by16(player.pos.x + playerSize)].solid === true ||
      tileMatrix[by16(player.pos.y)][by16(player.pos.x)].solid === true
    ) {
      player.pos = prevPos;
    }
  });

  let lastTime = 0;
  const render = (time = 0) => {
    const deltaTime = time - lastTime;
    context.clearRect(0, 0, context.width, context.height);
    renderBg(tileMatrix, spritesheet);

    entities.forEach(entity => {
      entity.draw(context, Boolean(entity.direction.x));
    });
    lastTime = time;
    window.requestAnimationFrame(render);
  };

  render();
};
main();
