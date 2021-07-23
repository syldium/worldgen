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

export function bgrCanvasToHexColor(color: number): string {
  return intColorToHex(rgbToBgrCanvas(color));
}

export function hexColorToBgrCanvas(color: string): number {
  return rgbToBgrCanvas(hexColorToInteger(color));
}
