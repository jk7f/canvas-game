import Entity from "../Entity.js";

export default class Door extends Entity {
  constructor(name, pos, spritesheet, connection, onRoomChange, side) {
    super(name, pos, spritesheet);
    this.connection = connection;
    this.onRoomChange = onRoomChange;
    this.side = side;
  }

  collides(them) {
    if (them.name === "player") {
      console.log(`entering room: ${this.connection.join("-")}`);
    }
  }
}
