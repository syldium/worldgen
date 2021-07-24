import { BoolNodeParams } from './BoolNode';
import { EitherNodeParams } from './EitherNode';
import { ColorNodeParams, NumberNodeParams } from './IntNode';
import { ObjectNodeParams, OptionalNodeParams } from './ObjectNode';
import { SwitchNodeParams } from './SwitchNode';
import { EnumNodeParams } from './EnumNode';
import { IdentifierNodeParams } from './ResourceNode';
import { ObjectOrNodeModel } from '../Model';
import { ListNodeParams } from './ListNode';
import { DataType } from '../../hook/useCrud';
import { MapNodeParams } from './MapNode';

export type NodeType =
  | 'bool'
  | 'color'
  | 'either'
  | 'enum'
  | 'float'
  | 'identifier'
  | 'int'
  | 'list'
  | 'map'
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
  | ColorNodeParams
  | EitherNodeParams
  | EnumNodeParams
  | IdentifierNodeParams
  | ListNodeParams<unknown>
  | MapNodeParams
  | NumberNodeParams
  | ObjectNodeParams
  | OptionalNodeParams
  | SwitchNodeParams;

export function isNode(model: ObjectOrNodeModel): model is ModelNode {
  return 'type' in model;
}

export function providePreset(node: ModelNode): DataType {
  const { type } = node;
  if (typeof node.default !== 'undefined') {
    return node.default as DataType;
  } else if (type === 'object') {
    return {};
  } else if (type === 'int' || type === 'float') {
    return 0;
  } else if (node.type === 'switch') {
    for (const val of Object.values(node.preset)) {
      if (typeof val === 'object') {
        return val;
      }
    }
    return { [node.typeField]: Object.keys(node.values)[0] };
  } else if (node.type === 'list') {
    return [];
  }
  return type === 'bool' ? false : '';
}
