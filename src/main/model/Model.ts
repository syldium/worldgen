import { GameVersion } from '../context/GameVersion';
import { isNode, ModelNode } from './node/Node';
import { ObjectNode } from './node/ObjectNode';

export interface Model {
  node: ModelNode;
  preset: (version: GameVersion) => Record<string, unknown>;
}

export const DefaultedModel = function <T extends Record<string, ModelNode>>(
  fields: T,
  preset: (version: GameVersion) => { [key in keyof Partial<T>]: unknown }
): Model {
  return { node: ObjectNode(fields), preset };
};

export type ObjectModel = Record<string, ModelNode>;
export type ObjectOrNodeModel = ModelNode | ObjectModel;

export function isValidModel(
  model: ObjectOrNodeModel,
  value: unknown
): boolean {
  if (isNode(model)) {
    return model.isValid(value);
  }
  if (value === null || typeof value !== 'object') {
    return false;
  }
  return Object.entries(model).every(([name, node]) =>
    node.isValid((value as Record<string, unknown>)[name])
  );
}
