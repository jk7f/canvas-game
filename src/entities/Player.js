import Entity from "../Entity.js";

export default class Player extends Entity {
  constructor() {
    super(...arguments);
    this.moveSpeed = 1.5;
    this.keyState = {
      up: false,
      down: false,
      left: false,
      right: false
    };
  }

  collides(them) {
    if (them.name === "chest") {
      alert("you hit the chest");
    }
  }

  move(tileMatrix, deltaTime = 16) {
    const by16 = coord => Math.floor(coord / 16);
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
      tileMatrix[by16(this.pos.y + playerSize)][by16(this.pos.x + playerSize)].solid === true ||
      tileMatrix[by16(this.pos.y + playerSize)][by16(this.pos.x)].solid === true ||
      tileMatrix[by16(this.pos.y)][by16(this.pos.x + playerSize)].solid === true ||
      tileMatrix[by16(this.pos.y)][by16(this.pos.x)].solid === true
    ) {
      this.pos = prevPos;
    }
  }
}
