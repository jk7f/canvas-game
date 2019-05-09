import Entity from "../Entity.js";

export default class Player extends Entity {
  constructor() {
    super(...arguments);
  }

  collides(them) {
    if (them.name === "chest") {
      alert("you hit the chest");
    }
  }
}
