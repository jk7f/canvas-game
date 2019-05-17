import createBackgroundLayer from "./layers/Background.js";
import createUiLayer from "./layers/UserInterface.js";
import Camera from "./Camera.js";
import Canvas from "./Canvas.js";
import Player from "./entities/Player.js";
import { loadImage, loadJson } from "./loaders.js";
import { setupWorld } from "./worldGenerator.js";
import createSpriteLayer from "./layers/Sprites.js";
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
    if (tile.tiles) {
      tile.tiles.forEach((tileVariant, index) => {
        spritesheet.define(`${tile.name}-${index}`, tileVariant[0], tileVariant[1]);
      });
    } else {
      spritesheet.define(tile.name, tile.tile[0], tile.tile[1]);
    }
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
  const levelTileset = await loadJson(level.tileset);
  const entityTileset = await loadJson("src/tiles/characters.json");
  const levelSpritesheet = new Spritesheet(await loadImage(levelTileset), levelTileset.size[0], levelTileset.size[1]);
  const entitySpritesheet = new Spritesheet(await loadImage(entityTileset), entityTileset.size[0], entityTileset.size[1]);
  const player = setupPlayer(entitySpritesheet, canvas);
  const onRoomChange = (roomIndex, originSide = "left") => {};
  defineTiles(levelTileset, levelSpritesheet);
  defineTiles(entityTileset, entitySpritesheet);
  const world = await setupWorld(level, levelSpritesheet, onRoomChange, player, canvas);
  const renderBackground = createBackgroundLayer(canvas.width, canvas.height, world.tileMatrix, levelSpritesheet);
  const renderSprites = createSpriteLayer(world.globalEntities);
  const renderUi = createUiLayer();
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
    renderSprites(camera, canvas.context, currentRoom.initializedEntities);
    renderUi(canvas.context, player);
    checkForSpriteCollisions(currentRoom, player);

    lastTime = time;
    window.requestAnimationFrame(render);
  };

  render();
};
main();
