import Door from "./entities/Door.js";

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

export const generateMap = new Promise((resolve, reject) => {
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

export const addDoorEntitiesToRoom = (map, index, spritesheet, width, height, onRoomChange) => {
  const room = map[index[0]][index[1]];

  // top
  if (map[index[0] - 1][index[1]]) {
    room.entities.push(
      new Door(
        "door",
        {
          x: width / 2,
          y: 0
        },
        spritesheet,
        [index[0] - 1, index[1]],
        onRoomChange,
        "top"
      )
    );
  }
  // bottom
  if (map[index[0] + 1][index[1]]) {
    room.entities.push(
      new Door(
        "door",
        {
          x: width / 2,
          y: height - 16
        },
        spritesheet,
        [index[0] + 1, index[1]],
        onRoomChange,
        "bottom"
      )
    );
  }
  // left
  if (map[index[0]][index[1] - 1]) {
    room.entities.push(
      new Door(
        "door",
        {
          x: 0,
          y: height / 2
        },
        spritesheet,
        [index[0], index[1] - 1],
        onRoomChange,
        "left"
      )
    );
  }
  // right
  if (map[index[0]][index[1] + 1]) {
    room.entities.push(
      new Door(
        "door",
        {
          x: width - 16,
          y: height / 2
        },
        spritesheet,
        [index[0], index[1] + 1],
        onRoomChange,
        "right"
      )
    );
  }

  return room;
};
