export const PackFormatString = {
  '1.16': 6,
  '1.17': 7,
  '1.18': 8,
  '1.18.2': 9,
  '1.19': 10,
  '1.19.4': 11
} as const;
export type GameVersion = keyof typeof PackFormatString;
export type PackFormat = typeof PackFormatString[keyof typeof PackFormatString];

export const PackFormatNumber: Record<PackFormat, GameVersion> = Object
  .fromEntries(
    Object.entries(PackFormatString).map((versions) => versions.reverse())
  );

export const RemovableModelsByVersion: Record<GameVersion, Set<string>> = {
  '1.16': new Set(),
  '1.17': new Set([
    'worldgen/configured_decorator'
  ]),
  '1.18': new Set(),
  '1.18.2': new Set(),
  '1.19': new Set(),
  '1.19.4': new Set()
};
