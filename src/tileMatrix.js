const walkLayer = (tileMatrix, layer, coords, rowIndex, colIndex) => {
  const [top, left, bottom, right] = coords;
  for (let x = left; x < right; x++) {
    for (let y = top; y < bottom; y++) {
      if (!Array.isArray(tileMatrix[y + rowIndex * 16])) {
        tileMatrix[y + rowIndex * 16] = [];
      }

      if (layer.variants) {
        //pick one of the variants
        const layerClone = JSON.parse(JSON.stringify(layer));
        layerClone.tile = `${layerClone.tile}-${Math.floor(Math.random() * layer.variants)}`;
        tileMatrix[y + rowIndex * 16][x + colIndex * 20] = layerClone;
      } else {
        tileMatrix[y + rowIndex * 16][x + colIndex * 20] = JSON.parse(JSON.stringify(layer));
      }
    }
  }

  return tileMatrix;
};

export const buildTileMatrix = (level, patterns) => {
  let tileMatrix = [];
  const addFloorTile = (row, col) => {
    const subject = tileMatrix[row][col];
    subject.tile = "floor-1";
    subject.solid = false;
  };
  level.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if (!col) {
        return;
      }
      col.layers.forEach(layer => {
        if (layer.pattern) {
          const pattern = patterns[layer.pattern];
          pattern.forEach(layerPattern => {
            tileMatrix = walkLayer(
              tileMatrix,
              layerPattern,
              [
                layerPattern.coords[0] + layer.coords[0],
                layerPattern.coords[1] + layer.coords[1],
                layerPattern.coords[2] + layer.coords[0],
                layerPattern.coords[3] + layer.coords[1]
              ],
              rowIndex,
              colIndex
            );
          });
        } else {
          tileMatrix = walkLayer(tileMatrix, layer, layer.coords, rowIndex, colIndex);
        }
      });
      col.entities.forEach(entity => {
        if (entity.name && entity.name.includes("door")) {
          if (entity.side === "top") {
            addFloorTile(rowIndex * 16, 10 + colIndex * 20, entity.name);
          } else if (entity.side === "bottom") {
            addFloorTile(15 + rowIndex * 16, 10 + colIndex * 20, entity.name);
          } else if (entity.side === "left") {
            addFloorTile(8 + rowIndex * 16, colIndex * 20, entity.name);
          } else if (entity.side === "right") {
            addFloorTile(8 + rowIndex * 16, 19 + colIndex * 20, entity.name);
          }
        }
      });
    });
  });
  return tileMatrix;
};
