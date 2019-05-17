import Door from "./entities/Door.js";
import Chest from "./entities/Chest.js";
import Entity from "./Entity.js";
import { buildTileMatrix } from "./tileMatrix.js";
import { generateRoomMatrix } from "./roomMatrix.js";

const addDoorEntitiesToRooms = (roomsMatrix, spritesheet, width, height, onRoomChange) => {
  roomsMatrix.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (!col) {
        return;
      }
      // top
      if (rowIndex > 0 && roomsMatrix[rowIndex - 1][colIndex]) {
        col.entities.push(
          new Door(
            "doorVert",
            {
              x: width / 2,
              y: 0
            },
            spritesheet,
            [rowIndex - 1, colIndex],
            onRoomChange,
            "top"
          )
        );
      }
      // bottom
      if (rowIndex < roomsMatrix.length - 2 && roomsMatrix[rowIndex + 1][colIndex]) {
        col.entities.push(
          new Door(
            "doorVert",
            {
              x: width / 2,
              y: height - 16
            },
            spritesheet,
            [rowIndex + 1, colIndex],
            onRoomChange,
            "bottom"
          )
        );
      }
      // left
      if (colIndex > 0 && roomsMatrix[rowIndex][colIndex - 1]) {
        col.entities.push(
          new Door(
            "doorHoriz",
            {
              x: 0,
              y: height / 2
            },
            spritesheet,
            [rowIndex, colIndex - 1],
            onRoomChange,
            "left"
          )
        );
      }
      // right
      if (colIndex < row.length - 1 && roomsMatrix[rowIndex][colIndex + 1]) {
        col.entities.push(
          new Door(
            "doorHoriz",
            {
              x: width - 16,
              y: height / 2
            },
            spritesheet,
            [rowIndex, colIndex + 1],
            onRoomChange,
            "right"
          )
        );
      }
    });
  });

  return roomsMatrix;
};

const generateRooms = async level => {
  const matrix = await generateRoomMatrix;
  const matrixWithRooms = matrix.map(row => {
    const rowWithRooms = row.map(col => {
      if (col === 1) {
        return JSON.parse(JSON.stringify(level.roomTypes[Math.floor(Math.random() * level.roomTypes.length)]));
      } else {
        return null;
      }
    });
    return rowWithRooms;
  });
  return matrixWithRooms;
};

const initializeEntities = (rooms, spritesheet) => {
  rooms.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (!col) {
        return;
      }
      col.initializedEntities = [];
      col.entities.forEach(entity => {
        // we already added the doors as entity, no need to readd
        const isInstanceOfEntity = entity instanceof Entity;
        const offsetX = colIndex * 20 * 16;
        const offsetY = rowIndex * 16 * 16;
        if (isInstanceOfEntity === false) {
          if (entity.tile === "chest") {
            col.initializedEntities.push(
              new Chest(entity.tile, { x: entity.coords[0] + offsetX, y: entity.coords[1] + offsetY }, spritesheet)
            );
          } else {
            col.initializedEntities.push(
              new Entity(entity.tile, { x: entity.coords[0] + offsetX, y: entity.coords[1] + offsetY }, spritesheet)
            );
          }
        } else {
          entity.pos.x += offsetX;
          entity.pos.y += offsetY;
          col.initializedEntities.push(entity);
        }
      });
    });
  });
  return rooms;
};

export const setupWorld = async (level, spritesheet, onRoomChange, player, canvas) => {
  const { patterns } = level;
  const world = {};
  world.rooms = addDoorEntitiesToRooms(await generateRooms(level), spritesheet, canvas.width, canvas.height, onRoomChange);
  world.tileMatrix = buildTileMatrix(world.rooms, patterns);
  initializeEntities(world.rooms, spritesheet);
  world.globalEntities = [];
  world.globalEntities.push(player);
  return world;
};
