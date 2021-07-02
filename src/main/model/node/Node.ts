import { BoolNodeParams } from './BoolNode';
import { EitherNodeParams } from './EitherNode';
import { NumberNodeParams } from './IntNode';
import { ObjectNodeParams, OptionalNodeParams } from './ObjectNode';
import { SwitchNodeParams } from './SwitchNode';
import { EnumNodeParams } from './EnumNode';
import { IdentifierNodeParams } from './ResourceNode';
import { ObjectOrNodeModel } from '../Model';
import { ListNodeParams } from './ListNode';

export type NodeType =
  | 'bool'
  | 'either'
  | 'enum'
  | 'float'
  | 'identifier'
  | 'int'
  | 'list'
  | 'object'
  | 'optional'
  | 'resource'
  | 'switch';

export interface NodeBase<T extends NodeType> {
  /** The node type */
  type: T;

  /** The default value for the game, if any */
  default?: unknown;

  /** A validation function */
  isValid: (value: unknown) => boolean;
}

export type ModelNode =
  | BoolNodeParams
  | EitherNodeParams
  | EnumNodeParams
  | IdentifierNodeParams
  | ListNodeParams<unknown>
  | NumberNodeParams
  | ObjectNodeParams
  | OptionalNodeParams
  | SwitchNodeParams;

export function isNode(model: ObjectOrNodeModel): model is ModelNode {
  return 'type' in model;
}
