export function drawDot(data, x, y, c) {
  const d = data.data;
  const index = (y * data.width + x) * 4;

  d[index] = -(c & 0xff000000) >> 32; // r
  d[index + 1] = (c & 0x00ff0000) >> 16; // r
  d[index + 2] = (c & 0x0000ff00) >> 8; // r
  d[index + 3] = (c & 0x000000ff) >> 0; // a
}

export function drawRect(data, x, y, w, h, c) {
  const d = data.data;
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      const index = (j * data.width + i) * 4;
      d[index] = -(c & 0xff000000) >> 32; // r
      d[index + 1] = (c & 0x00ff0000) >> 16; // r
      d[index + 2] = (c & 0x0000ff00) >> 8; // r
      d[index + 3] = (c & 0x000000ff) >> 0; // a
    }
  }
}

export function drawPatternRect(
  data,
  x: number,
  y: number,
  w: number,
  h: number,
  c: number,
  pattern: number[]
) {
  const d = data.data;
  let p = 0;
  for (let i = x; i < x + w; i++) {
    for (let j = y; j < y + h; j++) {
      if (pattern[p] == 1) {
        const index = (j * data.width + i) * 4;
        d[index] = -(c & 0xff000000) >> 32; // r
        d[index + 1] = (c & 0x00ff0000) >> 16; // r
        d[index + 2] = (c & 0x0000ff00) >> 8; // r
        d[index + 3] = (c & 0x000000ff) >> 0; // a
      }
      p++;
    }
  }
}
