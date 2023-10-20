import { WorldgenRegistriesType } from '../../model/Registry';
import { Registries1_19_4 } from '../1.19.4/v1_19_4';
import { ConfiguredFeature } from './ConfiguredFeature';

export const Registries1_20: WorldgenRegistriesType = {
  ...Registries1_19_4,
  'worldgen/configured_feature': [ConfiguredFeature]
};
