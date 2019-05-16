import Door from "./entities/Door.js";
import Entity from "./Entity.js";

const cleanUpEmptyRowsAndCols = inputArr => {
  // get rid of all rows which are full of 0s
  const crop = arr => arr.filter(row => row.reduce((prev, cur) => cur + prev, 0));

  // loop over array, checking if each colum consists of only 0s
  const loop = () => {
    let changeOccured = false;
    cropped[0].forEach((col, colIndex) => {
      if (col === 0) {
        let safeToRemoveCol = true;
        cropped.forEach((row, rowIndex) => {
          if (rowIndex === 0) {
            return; //already checked
          }

          if (row[colIndex] !== 0) {
            safeToRemoveCol = false;
          }
        });
        if (safeToRemoveCol) {
          cropped.forEach(row => {
            changeOccured = true;
            row.splice(colIndex, 1);
          });
        }
      }
    });
    if (changeOccured) {
      loop();
    }
  };
  const cropped = crop(inputArr);
  loop();

  return cropped;
};

const generateStartingMatrix = size => {
  const matrix = [];
  // we make the array twice the size so we are still good if we roll the same direcion every time
  for (let row = 0; row < size * 2; row++) {
    matrix.push([]);
    for (let col = 0; col < size * 2; col++) {
      matrix[row].push(0);
    }
  }
  matrix[size - 1][size - 1] = size;
  return matrix;
};

const generateRoomMatrix = new Promise((resolve, reject) => {
  const TILESCOUNT = 40;
  const matrix = generateStartingMatrix(TILESCOUNT);

  const loop = () => {
    let shouldContinue = false;
    for (let row = 0; row < TILESCOUNT * 2; row++) {
      for (let col = 0; col < TILESCOUNT * 2; col++) {
        if (matrix[row][col] > 1) {
          shouldContinue = true;
          matrix[row][col]--;
          const direction = ["up", "down", "left", "right"][Math.floor(Math.random() * 4)];
          if (direction === "up") {
            matrix[row - 1][col] += 1;
          } else if (direction === "down") {
            matrix[row + 1][col] += 1;
          } else if (direction === "left") {
            matrix[row][col - 1] += 1;
          } else if (direction === "right") {
            matrix[row][col + 1] += 1;
          }
        }
      }
    }

    if (shouldContinue) {
      loop();
    } else {
      resolve(cleanUpEmptyRowsAndCols(matrix));
    }
  };

  loop();
});

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
            "door",
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
            "door",
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
            "door",
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
            "door",
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
          col.initializedEntities.push(
            new Entity(entity.tile, { x: entity.coords[0] + offsetX, y: entity.coords[1] + offsetY }, spritesheet)
          );
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
  const world = {};
  world.rooms = addDoorEntitiesToRooms(await generateRooms(level), spritesheet, canvas.width, canvas.height, onRoomChange);
  world.tileMatrix = buildTileMatrix(world.rooms);
  initializeEntities(world.rooms, spritesheet);
  world.globalEntities = [];
  world.globalEntities.push(player);
  return world;
};

const buildTileMatrix = level => {
  const tileMatrix = [];
  const addFloorTile = (row, col) => {
    const subject = tileMatrix[row][col];
    subject.tile = "floor";
    subject.solid = false;
  };
  level.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (!col) {
        return;
      }
      col.layers.forEach(layer => {
        const [top, left, bottom, right] = layer.coords;
        for (let x = left; x < right; x++) {
          for (let y = top; y < bottom; y++) {
            if (!Array.isArray(tileMatrix[y + rowIndex * 16])) {
              tileMatrix[y + rowIndex * 16] = [];
            }
            tileMatrix[y + rowIndex * 16][x + colIndex * 20] = JSON.parse(JSON.stringify(layer));
          }
        }
      });
      col.entities.forEach(entity => {
        if (entity.name === "door") {
          if (entity.side === "top") {
            addFloorTile(rowIndex * 16, 10 + colIndex * 20);
          } else if (entity.side === "bottom") {
            addFloorTile(15 + rowIndex * 16, 10 + colIndex * 20);
          } else if (entity.side === "left") {
            addFloorTile(8 + rowIndex * 16, colIndex * 20);
          } else if (entity.side === "right") {
            addFloorTile(8 + rowIndex * 16, 19 + colIndex * 20);
          }
        }
      });
    });
  });
  return tileMatrix;
};
