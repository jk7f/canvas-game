import Entity from "../Entity.js";
import { getTile } from "../utils.js";

export default class Player extends Entity {
  constructor() {
    super(...arguments);
    this.moveSpeed = 1.5;
    this.score = 0;
    this.keyState = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  collides(them) {}

  addScore(amount) {
    this.score += amount;
  }

  move(tileMatrix, deltaTime = 16) {
    const playerSize = 12;
    const prevPos = {};
    const { pos, keyState, moveSpeed, direction } = this;
    Object.assign(prevPos, this.pos);
    if (keyState.up) {
      pos.y -= moveSpeed * (deltaTime / 16);
    }
    if (keyState.down) {
      pos.y += moveSpeed * (deltaTime / 16);
    }
    if (keyState.left) {
      direction.x = 1;
      pos.x -= moveSpeed * (deltaTime / 16);
    }
    if (keyState.right) {
      direction.x = 0;
      pos.x += moveSpeed * (deltaTime / 16);
    }

    // collision check
    if (
      tileMatrix[getTile(this.pos.y + playerSize)][getTile(this.pos.x + playerSize)].solid === true ||
      tileMatrix[getTile(this.pos.y + playerSize)][getTile(this.pos.x)].solid === true ||
      tileMatrix[getTile(this.pos.y)][getTile(this.pos.x + playerSize)].solid === true ||
      tileMatrix[getTile(this.pos.y)][getTile(this.pos.x)].solid === true
    ) {
      this.pos = prevPos;
    } else {
      this.bbox.pos = pos;
    }
  }
}
