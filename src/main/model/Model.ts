import { GameVersion } from '../context/GameVersion';
import { ModelNode } from './node/Node';
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
