import { EitherNode } from '../../model/node/EitherNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import type { ModelNode } from '../../model/node/Node';
import { Obj } from '../../model/node/ObjectNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';

const SimpleIntProvider = (
  min: number = INT_MIN_VALUE,
  max: number = INT_MAX_VALUE
): [ModelNode, Record<string, ModelNode>] => {
  const intNode = IntNode({ min, max });
  const rangeModel = {
    min_inclusive: intNode,
    max_inclusive: intNode
  };
  const clampedModel = {
    ...rangeModel
  };
  return [
    EitherNode(
      intNode,
      SwitchNode(
        {
          constant: intNode,
          uniform: Obj(rangeModel),
          biased_to_bottom: Obj(rangeModel),
          clamped: Obj(clampedModel)
        },
        {},
        'value'
      )
    ),
    clampedModel
  ];
};

export const IntProvider = (
  min: number = INT_MIN_VALUE,
  max: number = INT_MAX_VALUE
): ModelNode => {
  const [node, clampedNode] = SimpleIntProvider(min, max);
  const [nonClampedNode, nonClampedClampedNode] = SimpleIntProvider();
  // TODO check
  nonClampedClampedNode.source = nonClampedNode;
  clampedNode.source = nonClampedNode;
  return node;
};

export const FloatProvider = (min?: number, max?: number): ModelNode => {
  const floatNode = FloatNode({ min, max });
  return EitherNode(
    floatNode,
    SwitchNode(
      {
        constant: floatNode,
        uniform: Obj({
          min_inclusive: floatNode,
          max_exclusive: floatNode
        }),
        clamped_normal: Obj({
          mean: FloatNode(),
          deviation: FloatNode(),
          min: floatNode,
          max: floatNode
        }),
        trapezoid: Obj({
          plateau: FloatNode(),
          min: floatNode,
          max: floatNode
        })
      },
      {
        uniform: {
          value: {
            min_inclusive: 0.75,
            max_exclusive: 1
          }
        },
        clamped_normal: {
          value: {
            mean: 0.1,
            deviation: 0.3,
            min: 0.1,
            max: 0.9
          }
        },
        trapezoid: {
          value: {
            min: 0,
            max: 6,
            plateau: 2
          }
        }
      },
      'value'
    )
  );
};
