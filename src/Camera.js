const lerp = (from, to, multiplier = 0.1) => (1 - multiplier) * from + multiplier * to;

export default class Camera {
  constructor() {
    this.pos = {
      x: 1280,
      y: 1024
    };
    this.size = { x: 320, y: 256 };
  }

  update(player) {
    const xGoal = Math.floor(player.pos.x / this.size.x) * this.size.x;
    const yGoal = Math.floor(player.pos.y / this.size.y) * this.size.y;

    this.pos.x = lerp(this.pos.x, xGoal);
    this.pos.y = lerp(this.pos.y, yGoal);
  }
}
