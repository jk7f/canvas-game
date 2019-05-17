import Entity from "../Entity.js";

export default class Chest extends Entity {
  constructor(name, pos, spritesheet, connection, onRoomChange, side) {
    super(name, pos, spritesheet);
    this.pickedUp = false;
  }

  collides(them) {
    if (them.name === "player") {
      if (!this.pickedUp) {
        them.addScore(10);
        this.pickedUp = true;
      }
    }
  }
}
