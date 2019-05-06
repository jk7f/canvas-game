import Entity from "../Entity.js";

export default class Player extends Entity {
  constructor(config) {
    super(config);
  }
  draw(context) {
    this.spritesheet.draw(this.name, context, this.pos.x, this.pos.y);
  }
}
