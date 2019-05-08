import { loadImage, loadJson } from "./Loaders.js";
import Spritesheet from "./Spritesheet.js";
import Player from "./entities/Player.js";
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");

canvas.setAttribute("style", `width:${canvas.getAttribute("width")}; height:${canvas.getAttribute("height")}`);

const scale = window.devicePixelRatio || 1;
canvas.width = canvas.getAttribute("width") * scale;
canvas.height = canvas.getAttribute("height") * scale;
context.scale(scale, scale);

loadJson("src/levels/01.json").then(level => {
  loadJson(level.tileset).then(tileset => {
    loadImage(tileset).then(img => {
      const spritesheet = new Spritesheet(img, tileset.size[0], tileset.size[1]);

      tileset.tiles.forEach(tile => {
        spritesheet.define(tile.name, tile.tile[0], tile.tile[1]);
      });

      spritesheet.define("player", 8, 3);
      const player = new Player({
        name: "player",
        pos: {
          x: 64,
          y: 64
        },
        spritesheet: spritesheet
      });

      window.addEventListener("keydown", e => {
        const movement = 8;
        const playerSize = 16;
        function by16(coord) {
          return Math.floor(coord / 16);
        }
        if (e.key === "ArrowRight") {
          player.pos.x += movement;
        } else if (e.key === "ArrowLeft") {
          player.pos.x -= movement;
        } else if (e.key === "ArrowUp") {
          player.pos.y -= movement;
        } else if (e.key === "ArrowDown") {
          player.pos.y += movement;
        }

        // collision check
        if (tileMatrix[by16(player.pos.y)][by16(player.pos.x + movement)].solid === true) {
          player.pos.x -= movement;
        }
        if (tileMatrix[by16(player.pos.y)][by16(player.pos.x)].solid === true) {
          player.pos.x += movement;
        }
        if (tileMatrix[by16(player.pos.y)][by16(player.pos.x)].solid === true) {
          player.pos.y += movement;
        }
        if (tileMatrix[by16(player.pos.y + movement)][by16(player.pos.x)].solid === true) {
          player.pos.y -= movement;
        }
      });

      const tileMatrix = [];
      level.layers.forEach(layer => {
        const [top, left, bottom, right] = layer.coords;
        for (let y = top; y < bottom; y++) {
          for (let x = left; x < right; x++) {
            if (!Array.isArray(tileMatrix[y])) {
              tileMatrix[y] = [];
            }
            tileMatrix[y][x] = layer;
          }
        }
      });

      function renderBg() {
        tileMatrix.forEach((row, rowIndex) => {
          row.forEach((column, colIndex) => {
            spritesheet.draw(column.tile, context, colIndex * 16, rowIndex * 16);
          });
        });
      }

      let lastTime = 0;
      function render(time = 0) {
        const deltaTime = time - lastTime;
        context.clearRect(0, 0, context.width, context.height);
        renderBg();

        player.draw(context);
        lastTime = time;
        window.requestAnimationFrame(render);
      }

      render();
    });
  });
});
