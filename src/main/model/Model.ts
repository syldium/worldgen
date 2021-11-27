import { GameVersion } from '../context/GameVersion';
import { isNode, ModelNode, NodeType } from './node/Node';
import { Typed } from './node/SwitchNode';
import { ColorNodeParams, NumberNodeParams } from './node/IntNode';
import { BoolNodeParams } from './node/BoolNode';
import { OptionalNodeParams } from './node/ObjectNode';

export interface Configured extends Typed {
  config: unknown;
}

export interface Model {
  node: ObjectOrNodeModel;
  preset: (version: GameVersion) => Record<string, unknown>;
}

export const EmptyModel: Model = { node: {}, preset: () => ({}) };

export const DefaultedModel = function <T extends ObjectModel>(
  fields: T,
  preset: (version: GameVersion) => { [key in keyof Partial<T>]: unknown }
): Model {
  return { node: fields, preset };
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
const inline: ReadonlySet<NodeType> = new Set<NodeType>([
  'bool',
  'color',
  'int',
  'float'
]);
export function mayInline(
  model: ModelNode
): model is
  | BoolNodeParams
  | ColorNodeParams
  | NumberNodeParams
  | OptionalNodeParams {
  return (
    inline.has(model.type) ||
    (model.type === 'optional' && inline.has(model.node.type))
  );
}
