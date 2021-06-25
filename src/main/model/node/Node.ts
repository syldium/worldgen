import { BoolNodeParams } from './BoolNode';
import { EitherNodeParams } from './EitherNode';
import { NumberNodeParams } from './IntNode';
import { ObjectNodeParams, OptionalNodeParams } from './ObjectNode';
import { SwitchNodeParams } from './SwitchNode';
import { EnumNodeParams } from './EnumNode';
import { IdentifierNodeParams } from './ResourceNode';

export type NodeType =
  | 'bool'
  | 'either'
  | 'enum'
  | 'float'
  | 'identifier'
  | 'int'
  | 'object'
  | 'optional'
  | 'resource'
  | 'switch';

export interface NodeBase<T extends NodeType> {
  /** The node type */
  type: T;

  /** A validation function */
  isValid: (value: unknown) => boolean;
}

export type ModelNode =
  | BoolNodeParams
  | EitherNodeParams
  | EnumNodeParams
  | IdentifierNodeParams
  | NumberNodeParams
  | ObjectNodeParams
  | OptionalNodeParams
  | SwitchNodeParams;
