import type { RegistryHolder } from '../Registry';
import type { ModelNode, NodeBase } from './Node';
import { ErrorCollector } from './Node';

type Nodes = readonly [
  ModelNode,
  ModelNode,
  ...ModelNode[]
];

export interface EitherNodeParams extends NodeBase<'either'> {
  nodes: Nodes;
  findCurrentIndex: (value: unknown, holder?: RegistryHolder) => number;
}

export const EitherNode = (...nodes: Nodes): EitherNodeParams => ({
  nodes,
  type: 'either',
  validate: function (
    path: string,
    value: unknown,
    errors: ErrorCollector,
    holder?: RegistryHolder
  ) {
    if (this.findCurrentIndex(value, holder) === -1) {
      errors.add(path, 'No model matches');
    }
  },
  findCurrentIndex: function (value: unknown, holder?: RegistryHolder): number {
    for (let i = 0; i < this.nodes.length; i++) {
      const e = new ErrorCollector();
      this.nodes[i].validate('', value, e, holder);
      if (!e.size) {
        return i;
      }
    }
    return -1;
  }
});
