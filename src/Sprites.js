const createSpriteLayer = (entities, width = 64, height = 64) => {
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext("2d");

  const drawSpriteLayer = (camera, context) => {
    entities.forEach(entity => {
      spriteBufferContext.clearRect(0, 0, width, height);
      entity.draw(spriteBufferContext, entity.direction.x > 0);
      context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
    });
  };
  return drawSpriteLayer;
};

export default createSpriteLayer;
