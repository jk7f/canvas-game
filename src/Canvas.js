export default class Canvas {
  constructor() {
    const scale = window.devicePixelRatio || 1;
    this.canvas = document.querySelector("#canvas");
    this.context = canvas.getContext("2d");
    this.CANVAS_WIDTH = canvas.getAttribute("width");
    this.CANVAS_HEIGHT = canvas.getAttribute("height");
    this.canvas.setAttribute("style", `width:${this.CANVAS_WIDTH}; height:${this.CANVAS_HEIGHT}`);
    this.canvas.width = this.CANVAS_WIDTH * scale;
    this.canvas.height = this.CANVAS_HEIGHT * scale;
    this.context.scale(scale, scale);
  }

  get width() {
    return this.CANVAS_WIDTH;
  }
  get height() {
    return this.CANVAS_HEIGHT;
  }
}
