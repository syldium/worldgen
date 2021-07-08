import { ModelNode } from '../../model/node/Node';
import { EitherNode } from '../../model/node/EitherNode';
import { SwitchNode } from '../../model/node/SwitchNode';
import { FloatNode } from '../../model/node/FloatNode';
import { IntNode } from '../../model/node/IntNode';
import { ObjectModel } from '../../model/Model';
import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';

export const IntProvider = (
  min: number = INT_MIN_VALUE,
  max: number = INT_MAX_VALUE
): ModelNode => {
  const intNode = IntNode({ min, max });
  const rangeModel: ObjectModel = {
    min_inclusive: intNode,
    max_inclusive: intNode
  };
  return EitherNode(
    intNode,
    SwitchNode(
      {
        constant: intNode,
        uniform: rangeModel,
        biased_to_bottom: rangeModel,
        clamped: rangeModel
      },
      {},
      'value'
    )
  );
};

export const FloatProvider = (min?: number, max?: number): ModelNode => {
  const floatNode = FloatNode();
  return EitherNode(
    floatNode,
    SwitchNode(
      {
        constant: floatNode,
        uniform: {
          min_inclusive: floatNode,
          max_exclusive: floatNode
        },
        clamped_normal: {
          mean: FloatNode(),
          deviation: FloatNode(),
          min: FloatNode(),
          max: FloatNode()
        },
        trapezoid: {
          plateau: FloatNode(),
          min: FloatNode(),
          max: FloatNode()
        }
      },
      {},
      'value'
    )
  );
};
