import { ObjectOrNodeModel } from '../Model';
import { ErrorCollector, NodeBase } from './Node';

type Nodes = readonly [
  ObjectOrNodeModel,
  ObjectOrNodeModel,
  ...ObjectOrNodeModel[]
];

export interface EitherNodeParams extends NodeBase<'either'> {
  nodes: Nodes;
  findCurrentIndex: (value: unknown) => number;
}

export const EitherNode = (...nodes: Nodes): EitherNodeParams => ({
  nodes,
  type: 'either',
  validate: function (path: string, value: unknown, errors: ErrorCollector) {
    if (this.findCurrentIndex(value) === -1) {
      errors.add(path, 'No model matches');
    }
  },
  findCurrentIndex: function (value: unknown): number {
    for (let i = 0; i < this.nodes.length; i++) {
      const e = new ErrorCollector();
      this.nodes[i].validate('', value, e);
      if (!e.size) {
        return i;
      }
    }
    return -1;
  }
});
