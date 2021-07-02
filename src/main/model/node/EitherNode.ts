import { NodeBase } from './Node';
import { isValidModel, ObjectOrNodeModel } from '../Model';

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
  isValid: (value: unknown) =>
    nodes.some((model) => isValidModel(model, value)),
  findCurrentIndex: (value: unknown) =>
    nodes.findIndex((model) => isValidModel(model, value))
});
