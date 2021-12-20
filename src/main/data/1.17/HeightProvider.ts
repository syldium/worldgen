import { ObjectModel } from '../../model/Model';
import { EitherNode } from '../../model/node/EitherNode';
import { IntNode } from '../../model/node/IntNode';
import { ObjectNode } from '../../model/node/ObjectNode';
import { SwitchNode } from '../../model/node/SwitchNode';

export const YOffset = EitherNode(
  ObjectNode({
    absolute: IntNode({ min: -2032, max: 2031 })
  }),
  ObjectNode({
    above_bottom: IntNode({ min: -2032, max: 2031 })
  }),
  ObjectNode({
    below_top: IntNode({ min: -2032, max: 2031 })
  })
);

const Uniform: ObjectModel = {
  min_inclusive: YOffset,
  max_inclusive: YOffset
};

const BiasedToBottom: ObjectModel = {
  ...Uniform,
  inner: IntNode({ min: 1, default: 1 })
};

export const HeightProvider = EitherNode(
  YOffset,
  SwitchNode(
    {
      uniform: Uniform,
      biased_to_bottom: BiasedToBottom,
      very_biased_to_bottom: BiasedToBottom,
      trapezoid: {
        ...Uniform,
        plateau: IntNode({ default: 0 })
      },
      constant: EitherNode(YOffset, {
        value: YOffset
      })
    },
    {
      uniform: {
        min_inclusive: {
          above_bottom: 8
        },
        max_inclusive: {
          absolute: 126
        }
      },
      biased_to_bottom: {
        min_inclusive: {
          absolute: 0
        },
        max_inclusive: {
          absolute: 127
        },
        inner: 8
      },
      very_biased_to_bottom: {
        min_inclusive: {
          above_bottom: 0
        },
        max_inclusive: {
          below_top: 8
        },
        inner: 8
      },
      trapezoid: {
        min_inclusive: {
          absolute: 0
        },
        max_inclusive: {
          absolute: 192
        }
      }
    },
    null
  )
);
