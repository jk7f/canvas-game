export default class Entity {
  constructor(config) {
    this.name = config.name;
    this.pos = config.pos;
    this.spritesheet = config.spritesheet;
  }

  update() {}

  draw() {}
}
