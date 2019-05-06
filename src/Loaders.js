export function loadImage(tileset) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      resolve(img);
    });
    img.src = tileset.url;
  });
}

export function loadJson(url) {
  return fetch(url).then(response => {
    return response.json();
  });
}
