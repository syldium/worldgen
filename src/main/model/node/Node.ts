import { DataType } from '../../hook/useCrud';
import { ObjectOrNodeModel } from '../Model';
import { RegistryHolder } from '../Registry';
import { BoolNodeParams } from './BoolNode';
import { EitherNodeParams } from './EitherNode';
import { EnumNodeParams } from './EnumNode';
import { ColorNodeParams, NumberNodeParams } from './IntNode';
import { ListNodeParams } from './ListNode';
import { MapNodeParams } from './MapNode';
import { ObjectNodeParams, OptionalNodeParams } from './ObjectNode';
import {
  IdentifierNodeParams,
  ResourceNodeParams,
  TagNodeParams
} from './ResourceNode';
import { StringNodeParams } from './StringNode';
import { SwitchNodeParams } from './SwitchNode';

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
  | 'switch'
  | 'tag';

export interface PathError {
  path: string;
  error: string;
}

export class ErrorCollector {
  errors: PathError[] = [];

  add(path: string, error: string) {
    this.errors.push({ path, error });
  }

  get size(): number {
    return this.errors.length;
  }
}

type Validate = (
  path: string,
  value: unknown,
  errors: ErrorCollector,
  holder?: RegistryHolder
) => void;

export interface NodeBase<T extends NodeType> {
  /** The node type */
  type: T;

  /** The default value for the game, if any */
  default?: unknown;

  /** A validation function */
  validate: Validate;
}

export type ModelNode =
  | BoolNodeParams
  | ColorNodeParams
  | EitherNodeParams
  | EnumNodeParams
  | IdentifierNodeParams<'identifier'>
  | ListNodeParams
  | MapNodeParams
  | NumberNodeParams
  | ObjectNodeParams
  | OptionalNodeParams
  | ResourceNodeParams
  | StringNodeParams
  | SwitchNodeParams
  | TagNodeParams;

function createPreset(node: Record<string, ModelNode>) {
  return Object.fromEntries(
    Object.entries(node)
      .filter((r) => r[1].type !== 'optional')
      .map(([name, p]) => [name, providePreset(p)])
  );
}
export function providePreset(node: ObjectOrNodeModel): DataType {
  if (typeof node.default !== 'undefined') {
    return node.default as DataType;
  }
  switch (node.type) {
    case 'bool':
      return false;
    case 'either': {
      const nodes = node.nodes[0];
      return providePreset(nodes);
    }
    case 'enum':
      return node.values.length ? node.values[0].value : '';
    case 'color':
    case 'int':
    case 'float':
      return 0;
    case 'list':
      return node.fixed === -1 ?
        [] :
        new Array(node.fixed).fill(providePreset(node.of));
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
      const preset = providePreset(nodes);
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
