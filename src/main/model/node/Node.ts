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
import { StringNodeParams } from './StringNode';

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
  | 'string'
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
  | ListNodeParams
  | MapNodeParams
  | NumberNodeParams
  | ObjectNodeParams
  | OptionalNodeParams
  | StringNodeParams
  | SwitchNodeParams;

export function isNode(model: ObjectOrNodeModel): model is ModelNode {
  return 'type' in model && typeof model.type === 'string';
}

function createPreset(node: Record<string, ModelNode>) {
  return Object.fromEntries(
    Object.entries(node)
      .filter((r) => r[1].type !== 'optional')
      .map(([name, p]) => [name, providePreset(p)])
  );
}
export function providePreset(node: ModelNode): DataType {
  if (typeof node.default !== 'undefined') {
    return node.default as DataType;
  }
  switch (node.type) {
    case 'bool':
      return false;
    case 'either': {
      const nodes = node.nodes[0];
      return isNode(nodes) ? providePreset(nodes) : createPreset(nodes);
    }
    case 'enum':
      return node.values.length ? node.values[0].value : '';
    case 'color':
    case 'int':
    case 'float':
      return 0;
    case 'list':
      return node.fixed === -1
        ? []
        : new Array(node.fixed).fill(providePreset(node.of));
    case 'map':
      return {};
    case 'object':
      return createPreset(node.records);
    case 'optional':
      return providePreset(node.node);
    case 'switch': {
      for (const val of Object.values(node.preset)) {
        if (typeof val === 'object') {
          return val;
        }
      }
      const type = Object.keys(node.values)[0];
      const nodes = node.values[type];
      const preset = isNode(nodes) ? providePreset(nodes) : createPreset(nodes);
      if (node.config) {
        return { [node.typeField]: type, [node.config]: preset };
      } else if (typeof preset === 'object') {
        return { [node.typeField]: type, ...preset };
      }
      return { [node.typeField]: type };
    }
    default:
      return '';
  }
}
