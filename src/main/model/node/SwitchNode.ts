import {
  defaultNamespace,
  stripDefaultNamespace
} from '../../util/LabelHelper';
import { NodeBase } from './Node';
import { ObjectOrNodeModel } from '../Model';
import { ObjectNodeParams } from './ObjectNode';

type AnyKeyExcept<S extends string> = {
  [key: string]: unknown;
} & { [k in S]?: never };
type ModelType = Exclude<ObjectOrNodeModel, ObjectNodeParams>;
type PresetType<T extends string | number | symbol, S extends string> = {
  [K in T]: AnyKeyExcept<S>;
};

export interface SwitchNodeParams extends NodeBase<'switch'> {
  values: Record<string, ModelType>;
  config: string | null;
  typeField: string;
  preset: { [type in string]: Record<string, unknown> };
}

function isTyped(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

/**
 * Creates a node with a <code>type</code> field defining which node from <code>records</code> to use.
 *
 * @param values
 * @param preset
 * @param config
 * @param typeField
 */
export const SwitchNode = <
  T extends Record<string, ModelType>,
  S extends string = 'type'
>(
  values: T,
  preset: Partial<PresetType<keyof T, S>> = {},
  config: string | null = 'config',
  typeField = 'type' as S
): SwitchNodeParams => {
  Object.entries(preset).forEach(([key, value]) => {
    if (!Object.prototype.hasOwnProperty.call(value, typeField)) {
      (value as Record<string, unknown>)[typeField] = defaultNamespace(key);
    }
  });
  return {
    values,
    preset: preset as Record<string, Record<string, unknown>>,
    config,
    typeField,
    type: 'switch',
    isValid: (value: unknown) => {
      if (!isTyped(value) || (config && !value[config])) {
        return false;
      }
      if (Object.prototype.hasOwnProperty.call(value, typeField)) {
        return stripDefaultNamespace(value[typeField] as string) in values;
      }
      return false;
    }
  };
};

export const forEveryType = <S extends string = 'type'>(
  types: ReadonlyArray<string>,
  value: ModelType,
  preset?: Partial<PresetType<typeof types[number], S>>,
  config?: string | null,
  typeField = 'type' as S
): SwitchNodeParams =>
  SwitchNode(
    types.reduce((prev, type) => {
      prev[type] = value;
      return prev;
    }, {} as Record<string, ModelType>),
    preset,
    config,
    typeField
  );

export interface Typed {
  type: string;
}
