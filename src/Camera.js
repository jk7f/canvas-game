export default class Camera {
  constructor() {
    this.pos = {
      x: 1280,
      y: 1024
    };
    this.size = { x: 320, y: 256 };
  }

  update(player) {
    this.pos.x = Math.floor(player.pos.x / this.size.x) * this.size.x;
    this.pos.y = Math.floor(player.pos.y / this.size.y) * this.size.y;
  }
}
