import BoundingBox from "./BoundingBox.js";

export default class Entity {
  constructor(
    name,
    pos,
    spritesheet,
    size = {
      x: 16,
      y: 16
    }
  ) {
    this.name = name;
    this.pos = pos;
    this.direction = {
      x: 0,
      y: 0
    };
    this.spritesheet = spritesheet;
    this.bbox = new BoundingBox(pos, size);
  }

  update() {}

  collides(them) {}

  draw(context, flipped = false) {
    this.spritesheet.draw(flipped ? this.name + "-flipped" : this.name, context, this.pos.x, this.pos.y);
  }
}
