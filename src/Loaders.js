export const loadImage = tileset =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.src = tileset.url;
  });

export const loadJson = url => fetch(url).then(response => response.json());
