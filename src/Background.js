const createBackground = (width, height, tiles, sprites) => {
  const buffer = document.createElement("canvas");
  buffer.width = width;
  buffer.height = height;
  const context = buffer.getContext("2d");

  const render = (camera, canvasContext) => {
    context.clearRect(0, 0, buffer.width, buffer.height);
    const getTile = coord => Math.floor(coord / 16);
    const cameraX16 = getTile(camera.pos.x);
    const cameraY16 = getTile(camera.pos.y);
    for (let startX = cameraX16; startX < cameraX16 + getTile(camera.size.x); startX++) {
      for (let startY = cameraY16; startY < cameraY16 + getTile(camera.size.y); startY++) {
        const column = tiles[startY][startX];
        if (!column) {
          sprites.draw("empty", context, (startX - cameraX16) * 16, (startY - cameraY16) * 16);
        } else {
          sprites.draw(column.tile, context, (startX - cameraX16) * 16, (startY - cameraY16) * 16);
        }
      }
    }

    canvasContext.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y % 16);
  };
  return render;
};

export default createBackground;
