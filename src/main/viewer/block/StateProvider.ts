import type { BlockStateValue } from '../../component/resource/BlockState';
import { IntProvider } from '../../data/1.17/NumberProvider';
import { DataType } from '../../hook/useCrud';
import { ModelNode } from '../../model/node/Node';
import { Typed } from '../../model/node/SwitchNode';
import { BlockStateRegistry } from '../../model/Registry';
import {
  defaultNamespace,
  stripDefaultNamespace
} from '../../util/LabelHelper';
import { areConsecutiveIntegers } from '../../util/MathHelper';

export interface WeightedStateEntry {
  weight: number;
  data: BlockStateValue;
}

interface SimpleStateProvider {
  state: BlockStateValue;
}
interface Noise2dStateProvider {
  states: BlockStateValue[];
}
interface Noise2dCutoffStateProvider {
  default_state: BlockStateValue;
  low_states: BlockStateValue[];
  high_states: BlockStateValue[];
}
interface WeightedStateProvider {
  entries: WeightedStateEntry[];
}
export interface RandomizedIntStateProvider {
  property: string;
  source: StateProvider;
  values: DataType; // IntProvider
}
export type StateProvider =
  & Partial<SimpleStateProvider>
  & Partial<WeightedStateProvider>
  & Partial<RandomizedIntStateProvider>
  & Partial<Noise2dStateProvider>
  & Partial<Noise2dCutoffStateProvider>
  & Typed;

export function findBlockTypes(provider: StateProvider): string[] {
  switch (stripDefaultNamespace(provider.type)) {
    case 'simple_state_provider':
    case 'rotated_block_provider':
      return [provider.state!.Name];
    case 'weighted_state_provider':
      return provider
        .entries!.filter((entry) => entry.weight !== 0)
        .map((entry) => entry.data.Name);
    case 'plain_flower_provider':
      return [
        'poppy',
        'azure_bluet',
        'oxeye_daisy',
        'cornflower',
        'orange_tulip',
        'red_tulip',
        'pink_tulip',
        'white_tulip'
      ];
    case 'forest_flower_provider':
      return [
        'dandelion',
        'poppy',
        'allium',
        'azure_bluet',
        'red_tulip',
        'orange_tulip',
        'white_tulip',
        'pink_tulip',
        'oxeye_daisy',
        'cornflower',
        'lily_of_the_valley'
      ];
    case 'noise_provider':
    case 'dual_noise_provider':
      return provider.states!.map((entry) => entry.Name);
    case 'noise_threshold_provider':
      return [
        provider.default_state!,
        ...provider.low_states!,
        ...provider.high_states!
      ].map((entry) => entry.Name);
    case 'randomized_int_state_provider':
      return findBlockTypes(provider.source!);
    default:
      return [];
  }
}

export function findIntProviderFromProperties(
  blockTypes: readonly string[],
  registry: BlockStateRegistry
): { [property: string]: ModelNode } {
  const blocksByProperty: Record<string, string[]> = {};
  for (const blockType of blockTypes) {
    const state = registry[defaultNamespace(blockType)];
    if (state && state.properties) {
      for (const [property, values] of Object.entries(state.properties)) {
        if (areConsecutiveIntegers(values)) {
          const blocks = blocksByProperty[property] || [];
          blocks.push(blockType);
          blocksByProperty[property] = blocks;
        }
      }
    }
  }

  const intProviderByProperty: Record<string, ModelNode> = {};
  for (const [property, blocks] of Object.entries(blocksByProperty)) {
    if (blocks.length === blockTypes.length) {
      let min = Number.MIN_SAFE_INTEGER;
      let max = Number.MAX_SAFE_INTEGER;
      for (const blockType of blockTypes) {
        const values = Object.values(
          registry[defaultNamespace(blockType)].properties[property]
        );
        const cmin = parseInt(values[0]);
        const cmax = parseInt(values[values.length - 1]);
        if (cmin > min) {
          min = cmin;
        }
        if (cmax < max) {
          max = cmax;
        }
      }
      intProviderByProperty[property] = IntProvider(min, max);
    }
  }
  return intProviderByProperty;
}
