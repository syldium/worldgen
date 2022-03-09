import type { GameVersion } from '../context/GameVersion';
import type { BoolNodeParams } from './node/BoolNode';
import type { ColorNodeParams, NumberNodeParams } from './node/IntNode';
import type { ModelNode, NodeType } from './node/Node';
import type { OptionalNodeParams } from './node/ObjectNode';
import { Empty, Obj } from './node/ObjectNode';
import type { Typed } from './node/SwitchNode';

export interface Configured extends Typed {
  config: unknown;
}

export interface Model {
  node: ModelNode;
  preset: (version: GameVersion) => Record<string, unknown>;
}

export const EmptyModel: Model = { node: Empty, preset: () => ({}) };

export const DefaultedModel = function<T extends Record<string, ModelNode>> (
  fields: T,
  preset: (version: GameVersion) => { [key in keyof Partial<T>]: unknown }
): Model {
  return { node: Obj(fields), preset };
};

export type ObjectOrNodeModel = ModelNode;

export const isValidModel = (
  model: ObjectOrNodeModel,
  value: unknown
): boolean => model.isValid(value);

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
  | OptionalNodeParams
{
  return (
    inline.has(model.type) ||
    (model.type === 'optional' && inline.has(model.node.type))
  );
}
