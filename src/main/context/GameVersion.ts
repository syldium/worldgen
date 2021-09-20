export type GameVersion = '1.16' | '1.17' | '1.18';
export const PackFormatString: Record<GameVersion, number> = {
  '1.16': 6,
  '1.17': 7,
  '1.18': 8
};

export const PackFormatNumber: Record<number, GameVersion> = Object.fromEntries(
  Object.entries(PackFormatString).map((versions) => versions.reverse())
);
