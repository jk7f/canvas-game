import { loadImage, loadJson } from "./Loaders.js";
import Spritesheet from "./Spritesheet.js";
import Player from "./entities/Player.js";
import Entity from "./Entity.js";
import { generateMap, addDoorEntitiesToRoom } from "./mapGenerator.js";

const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const scale = window.devicePixelRatio || 1;
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");
canvas.setAttribute("style", `width:${CANVAS_WIDTH}; height:${CANVAS_HEIGHT}`);
canvas.width = CANVAS_WIDTH * scale;
canvas.height = CANVAS_HEIGHT * scale;
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

const generateRooms = async level => {
  const map = await generateMap;
  const mapWithRooms = map.map(row => {
    const rowWithRooms = row.map(col => {
      if (col === 1) {
        return level.roomTypes[Math.floor(Math.random() * level.roomTypes.length)];
      } else {
        return null;
      }
    });
    return rowWithRooms;
  });
  return mapWithRooms;
};

const setupRoom = (map, currentRoomIndex, spritesheet, onRoomChange, originSide = "left", player) => {
  console.log(`setting up room: ${currentRoomIndex.join("-")}`);
  const currentRoom = addDoorEntitiesToRoom(map, currentRoomIndex, spritesheet, CANVAS_WIDTH, CANVAS_HEIGHT, onRoomChange);
  currentRoom.tileMatrix = buildTileMatrix(currentRoom);
  currentRoom.initializedEntities = [];
  currentRoom.entities.forEach(entity => {
    // we already added the doors as entity, no need to readd
    const isInstanceOfEntity = entity instanceof Entity;
    if (isInstanceOfEntity === false) {
      currentRoom.initializedEntities.push(new Entity(entity.tile, { x: entity.coords[0], y: entity.coords[1] }, spritesheet));
    } else {
      currentRoom.initializedEntities.push(entity);
    }
  });

  if (originSide === "top") {
    //player emerges from the bottom
    player.pos.x = CANVAS_WIDTH / 2;
    player.pos.y = CANVAS_HEIGHT - 16;
  } else if (originSide === "bottom") {
    //player emerges from the top
    player.pos.x = CANVAS_WIDTH / 2;
    player.pos.y = 16;
  } else if (originSide === "left") {
    //player emerges from the right
    player.pos.x = CANVAS_WIDTH - 16;
    player.pos.y = CANVAS_HEIGHT / 2;
  } else if (originSide === "right") {
    //player emerges from the left
    player.pos.x = 16;
    player.pos.y = CANVAS_HEIGHT / 2;
  }
  return currentRoom;
};

const setupPlayerMovement = (player, tileMatrix) => {
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
};

const setupTiles = (tileset, spritesheet) => {
  tileset.tiles.forEach(tile => {
    spritesheet.define(tile.name, tile.tile[0], tile.tile[1]);
  });
};

const setupPlayer = spritesheet => {
  spritesheet.define("player", 8, 3);
  const player = new Player(
    "player",
    {
      x: 64,
      y: 64
    },
    spritesheet
  );

  return player;
};

const main = async () => {
  const level = await loadJson("src/levels/01.json");
  const map = await generateRooms(level);
  console.log(map);
  const tileset = await loadJson(level.tileset);
  const spriteImage = await loadImage(tileset);
  const spritesheet = new Spritesheet(spriteImage, tileset.size[0], tileset.size[1]);
  const player = setupPlayer(spritesheet);
  const onRoomChange = (roomIndex, originSide) => {
    currentRoom = setupRoom(map, roomIndex, spritesheet, onRoomChange, originSide, player);
  };
  const currentRoomIndex = [4, 4];
  setupTiles(tileset, spritesheet);
  let currentRoom = setupRoom(map, currentRoomIndex, spritesheet, onRoomChange, player);
  setupPlayerMovement(player, currentRoom.tileMatrix);
  console.log(currentRoom);

  currentRoom.initializedEntities.push(player);

  let lastTime = 0;
  const render = (time = 0) => {
    const deltaTime = time - lastTime;
    const { initializedEntities, tileMatrix } = currentRoom;
    context.clearRect(0, 0, context.width, context.height);
    renderBg(tileMatrix, spritesheet);

    initializedEntities.forEach(entity => {
      initializedEntities.forEach(checkEntity => {
        if (entity === checkEntity) {
          return;
        }

        if (entity.bbox.collides(checkEntity.bbox)) {
          console.log(`${entity.name} collided with ${checkEntity.name}`);
          entity.collides(checkEntity);
          checkEntity.collides(entity);
        }
      });
    });

    initializedEntities.forEach(entity => {
      entity.draw(context, Boolean(entity.direction.x));
    });
    lastTime = time;
    window.requestAnimationFrame(render);
  };

  render();
};
main();
