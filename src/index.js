import createBackgroundLayer from "./Background.js";
import Camera from "./Camera.js";
import Canvas from "./Canvas.js";
import Player from "./entities/Player.js";
import { loadImage, loadJson } from "./loaders.js";
import { setupWorld } from "./worldGenerator.js";
import createSpriteLayer from "./Sprites.js";
import Spritesheet from "./Spritesheet.js";

const setupPlayerMovement = player => {
  const onKeyDown = e => {
    const { key, type } = e;
    const pickState = () => (type === "keydown" ? true : false);
    if (key === "ArrowRight") {
      player.keyState.right = pickState();
    } else if (key === "ArrowLeft") {
      player.keyState.left = pickState();
    } else if (key === "ArrowUp") {
      player.keyState.up = pickState();
    } else if (key === "ArrowDown") {
      player.keyState.down = pickState();
    }
  };
  ["keydown", "keyup"].forEach(event => {
    window.addEventListener(event, onKeyDown);
  });
};

const defineTiles = (tileset, spritesheet) => {
  tileset.tiles.forEach(tile => {
    spritesheet.define(tile.name, tile.tile[0], tile.tile[1]);
  });
  spritesheet.define("empty", 1, 12);
};

const setupPlayer = (spritesheet, canvas) => {
  spritesheet.define("player", 8, 3);
  const player = new Player(
    "player",
    {
      x: 1280 + canvas.width / 2,
      y: 1024 + canvas.height / 2
    },
    spritesheet
  );

  return player;
};

const checkForSpriteCollisions = (currentRoom, player) => {
  // console.log(player.pos);
  // console.log(player.bbox.pos);
  const { initializedEntities } = currentRoom;
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

    if (entity.bbox.collides(player.bbox)) {
      console.log(`${entity.name} collided with player`);
      entity.collides(player);
      player.collides(entity);
    }
  });

  // initializedEntities.forEach(entity => {
  // 	entity.draw(context, Boolean(entity.direction.x));
  // });
};

const main = async () => {
  const camera = new Camera();
  const canvas = new Canvas();
  const level = await loadJson("src/levels/01.json");
  const tileset = await loadJson(level.tileset);
  const spritesheet = new Spritesheet(await loadImage(tileset), tileset.size[0], tileset.size[1]);
  const player = setupPlayer(spritesheet, canvas);
  const onRoomChange = (roomIndex, originSide = "left") => {};
  defineTiles(tileset, spritesheet);
  const world = await setupWorld(level, spritesheet, onRoomChange, player, canvas);
  const renderBackground = createBackgroundLayer(canvas.width, canvas.height, world.tileMatrix, spritesheet);
  const renderSprites = createSpriteLayer(world.globalEntities);
  console.log(world);
  setupPlayerMovement(player, world.tileMatrix);

  let lastTime = 0;

  const render = (time = 0) => {
    const deltaTime = time - lastTime;
    const { rooms, globalEntities } = world;
    const currentRoom = world.rooms[Math.floor(player.pos.y / canvas.height)][Math.floor(player.pos.x / canvas.width)];
    canvas.context.clearRect(0, 0, canvas.context.width, canvas.context.height);
    player.move(world.tileMatrix, deltaTime);

    camera.update(player, deltaTime);
    renderBackground(camera, canvas.context);
    renderSprites(camera, canvas.context);

    checkForSpriteCollisions(currentRoom, player);

    lastTime = time;
    window.requestAnimationFrame(render);
  };

  render();
};
main();
