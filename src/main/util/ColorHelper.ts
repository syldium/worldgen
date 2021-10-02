export function hexColorToInteger(color: string): number {
  return parseInt(color.replace(/^#/, ''), 16);
}

export function intColorToHex(color: number): string {
  return '#' + (color & 0xffffff).toString(16).padStart(6, '0');
}

export function rgbToBgrCanvas(color: number): number {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return (0xff << 24) | (b << 16) | (g << 8) | r;
}

export type ColorTuple = readonly [number, number, number];

export function rgbTupleToHex(color: ColorTuple): string {
  const r = (color[0] * 0xff) & 0xff;
  const g = (color[1] * 0xff) & 0xff;
  const b = (color[2] * 0xff) & 0xff;
  return intColorToHex((r << 16) | (g << 8) | b);
}

export function hexColorToRgbTuple(color: string): ColorTuple {
  const value = hexColorToInteger(color);
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  return [r / 0xff, g / 0xff, b / 0xff];
}

export function bgrCanvasToHexColor(color: number): string {
  return intColorToHex(rgbToBgrCanvas(color));
}

export function hexColorToBgrCanvas(color: string): number {
  return rgbToBgrCanvas(hexColorToInteger(color));
}
