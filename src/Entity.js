export default class Entity {
  constructor(name, pos, spritesheet) {
    this.name = name;
    this.pos = pos;
    this.direction = {
      x: 0,
      y: 0
    };
    this.spritesheet = spritesheet;
  }

  update() {}

  draw(context, flipped = false) {
    this.spritesheet.draw(flipped ? this.name + "-flipped" : this.name, context, this.pos.x, this.pos.y);
  }
}
