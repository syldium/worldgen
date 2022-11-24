import { omit } from '../../util/DataHelper';
import type { ModelNode, NodeBase, ValidationContext } from './Node';
import { ErrorCollector } from './Node';

type Nodes = readonly [
  ModelNode,
  ModelNode,
  ...ModelNode[]
];

export interface EitherNodeParams extends NodeBase<'either'> {
  nodes: Nodes;
  findCurrentIndex: (value: unknown, ctx?: ValidationContext) => number;
}

export const EitherNode = (...nodes: Nodes): EitherNodeParams => ({
  nodes,
  type: 'either',
  validate: function (
    path: string,
    value: unknown,
    errors: ErrorCollector,
    ctx?: ValidationContext
  ) {
    ctx = ctx ? omit(ctx, 'ignoreKeys') : undefined;
    if (this.findCurrentIndex(value, ctx) === -1) {
      errors.add(path, 'No model matches');
    }
  },
  findCurrentIndex: function (value: unknown, ctx?: ValidationContext): number {
    for (let i = 0; i < this.nodes.length; i++) {
      const e = new ErrorCollector();
      this.nodes[i].validate('', value, e, ctx);
      if (!e.size) {
        return i;
      }
    }
    return -1;
  }
});
