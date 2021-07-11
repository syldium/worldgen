export function hexColorToInteger(color: string): number {
  return parseInt(color.replace(/^#/, ''), 16);
}

export function integerColorToHex(color: number): string {
  return '#' + (color & 0xffffff).toString(16).padStart(6, '0');
}
