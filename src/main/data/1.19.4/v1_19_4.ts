import { WorldgenRegistriesType } from '../../model/Registry';
import { Registries1_19 } from '../1.19/v1_19';
import { Biome } from './Biome';

export const Registries1_19_4: WorldgenRegistriesType = {
  ...Registries1_19,
  'worldgen/biome': [Biome]
};
