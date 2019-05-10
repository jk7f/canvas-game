const generateMap = new Promise((resolve, reject) => {
  const TILESCOUNT = 40;

  const roomRows = [];
  for (let row = 0; row < TILESCOUNT * 2; row++) {
    roomRows.push([]);
    for (let col = 0; col < TILESCOUNT * 2; col++) {
      roomRows[row].push(0);
    }
  }

  roomRows[TILESCOUNT - 1][TILESCOUNT - 1] = TILESCOUNT;

  const cleanUpEmptyRowsAndCols = inputArr => {
    // get rid of all rows which are full of 0s
    const crop = arr => arr.filter(row => row.reduce((prev, cur) => cur + prev, 0));

    // loop over array, checking if each colum consists of only 0s
    const cropLoop = () => {
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
        cropLoop();
      }
    };
    const cropped = crop(inputArr);
    cropLoop();

    resolve(cropped);
  };

  const loop = () => {
    let shouldContinue = false;
    for (let row = 0; row < TILESCOUNT * 2; row++) {
      for (let col = 0; col < TILESCOUNT * 2; col++) {
        if (roomRows[row][col] > 1) {
          shouldContinue = true;
          roomRows[row][col]--;
          const direction = ["up", "down", "left", "right"][Math.floor(Math.random() * 4)];
          if (direction === "up") {
            roomRows[row - 1][col] += 1;
          } else if (direction === "down") {
            roomRows[row + 1][col] += 1;
          } else if (direction === "left") {
            roomRows[row][col - 1] += 1;
          } else if (direction === "right") {
            roomRows[row][col + 1] += 1;
          }
        }
      }
    }

    if (shouldContinue) {
      loop();
    } else {
      cleanUpEmptyRowsAndCols(roomRows);
    }
  };

  loop();
});

export default generateMap;
