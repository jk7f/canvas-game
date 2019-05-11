import { loadImage, loadJson } from "./Loaders.js";
import Spritesheet from "./Spritesheet.js";
import Player from "./entities/Player.js";
import Canvas from "./Canvas.js";
import { generateRooms, setupRooms } from "./mapGenerator.js";
import Camera from "./Camera.js";
import createBackground from "./Background.js";
import createSpriteLayer from "./Sprites.js";

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

const setupTiles = (tileset, spritesheet) => {
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

const main = async () => {
  const camera = new Camera();
  const canvas = new Canvas();
  const level = await loadJson("src/levels/01.json");
  const map = await generateRooms(level);
  const tileset = await loadJson(level.tileset);
  const spriteImage = await loadImage(tileset);
  const spritesheet = new Spritesheet(spriteImage, tileset.size[0], tileset.size[1]);
  const player = setupPlayer(spritesheet, canvas);
  const onRoomChange = (roomIndex, originSide = "left") => {};
  setupTiles(tileset, spritesheet);
  const world = setupRooms(map, spritesheet, onRoomChange, player, canvas);
  const renderBackground = createBackground(canvas.width, canvas.height, world.tileMatrix, spritesheet);
  const renderSprites = createSpriteLayer(world.globalEntities);
  console.log(world);
  setupPlayerMovement(player, world.tileMatrix);

  let lastTime = 0;

  const render = (time = 0) => {
    const deltaTime = time - lastTime;
    const { initializedEntities, globalEntities } = world;
    canvas.context.clearRect(0, 0, canvas.context.width, canvas.context.height);
    player.move(world.tileMatrix, deltaTime);
    camera.pos.x = Math.floor(player.pos.x / canvas.width) * canvas.width;
    camera.pos.y = Math.floor(player.pos.y / canvas.height) * canvas.height;
    renderBackground(camera, canvas.context);
    renderSprites(camera, canvas.context);

    // initializedEntities.forEach(entity => {
    //   initializedEntities.forEach(checkEntity => {
    //     if (entity === checkEntity) {
    //       return;
    //     }
    //     if (entity.bbox.collides(checkEntity.bbox)) {
    //       console.log(`${entity.name} collided with ${checkEntity.name}`);
    //       entity.collides(checkEntity);
    //       checkEntity.collides(entity);
    //     }
    //   });
    // });

    // initializedEntities.forEach(entity => {
    //   entity.draw(context, Boolean(entity.direction.x));
    // });
    lastTime = time;
    window.requestAnimationFrame(render);
  };

  render();
};
main();
