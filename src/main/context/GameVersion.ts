export type GameVersion = '1.16' | '1.17' | '1.18' | '1.18.2';
export const PackFormatString: Record<GameVersion, number> = {
  '1.16': 6,
  '1.17': 7,
  '1.18': 8,
  '1.18.2': 9
};

export const PackFormatNumber: Record<number, GameVersion> = Object.fromEntries(
  Object.entries(PackFormatString).map((versions) => versions.reverse())
);

export const RemovableModelsByVersion: Record<GameVersion, Set<string>> = {
  '1.16': new Set(),
  '1.17': new Set([
    'worldgen/configured_decorator'
  ]),
  '1.18': new Set(),
  '1.18.2': new Set()
};
