export const getTile = coord => Math.floor(coord / 16);

export const lerp = (from, to, multiplier = 0.1) => (1 - multiplier) * from + multiplier * to;
