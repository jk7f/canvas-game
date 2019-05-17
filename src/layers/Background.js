import { getTile } from "../utils.js";

const createBackgroundLayer = (width, height, tiles, sprites) => {
  const buffer = document.createElement("canvas");
  buffer.width = parseInt(width, 10) + 16;
  buffer.height = parseInt(height, 10) + 16;
  const context = buffer.getContext("2d");

  const render = (camera, topLevelCanvasContext) => {
    context.clearRect(0, 0, buffer.width, buffer.height);
    const cameraX16 = getTile(camera.pos.x);
    const cameraY16 = getTile(camera.pos.y);
    // render 1 extra tile to the right and bottom, to prevent the tile not rendering during scroll
    for (let startX = cameraX16; startX < cameraX16 + getTile(camera.size.x) + 1; startX++) {
      for (let startY = cameraY16; startY < cameraY16 + getTile(camera.size.y) + 1; startY++) {
        const column = tiles[startY][startX];
        if (!column) {
          sprites.draw("empty", context, (startX - cameraX16) * 16, (startY - cameraY16) * 16);
        } else {
          sprites.draw(column.tile, context, (startX - cameraX16) * 16, (startY - cameraY16) * 16);
        }
      }
    }
    topLevelCanvasContext.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y % 16);
  };
  return render;
};

export default createBackgroundLayer;
