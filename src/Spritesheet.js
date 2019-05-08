export default class Spritesheet {
  constructor(image, width, height) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.tiles = new Map();
  }

  define(name, x, y) {
    const buffer = document.createElement("canvas");
    buffer.width = this.width;
    buffer.height = this.height;
    buffer.getContext("2d").drawImage(this.image, x * this.width, y * this.height, this.width, this.height, 0, 0, this.width, this.height);
    this.tiles.set(name, buffer);

    const flipped = buffer.cloneNode();
    const flippedContext = flipped.getContext("2d");
    flippedContext.scale(-1, 1);
    flippedContext.translate(-this.width, 0);
    flippedContext.drawImage(this.image, x * this.width, y * this.height, this.width, this.height, 0, 0, this.width, this.height);
    this.tiles.set(name + "-flipped", flipped);
  }

  draw(name, context, x, y) {
    const buffer = this.tiles.get(name);
    context.drawImage(buffer, x, y);
  }
}
