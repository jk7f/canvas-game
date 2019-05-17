const createUiLayer = (width = 64, height = 64) => {
  const uiBuffer = document.createElement("canvas");
  uiBuffer.width = width;
  uiBuffer.height = height;
  const uiBufferContext = uiBuffer.getContext("2d");
  uiBufferContext.font = "12px monospace";
  uiBufferContext.fillStyle = "#FFFFFF";
  uiBufferContext.textAlign = "right";

  const drawUiLayer = (context, player) => {
    // uiBufferContext.clearRect(0, 0, width, height);
    uiBufferContext.fillText(player.score.toString().padStart(3, 0), width, 12);
    context.drawImage(uiBuffer, 320 - width, 0);
  };
  return drawUiLayer;
};

export default createUiLayer;
