import { EitherNode } from '../../model/node/EitherNode';
import { IntNode } from '../../model/node/IntNode';
import { Obj } from '../../model/node/ObjectNode';
import { SwitchNode } from '../../model/node/SwitchNode';

export const YOffset = EitherNode(
  Obj({
    absolute: IntNode({ min: -2032, max: 2031 })
  }),
  Obj({
    above_bottom: IntNode({ min: -2032, max: 2031 })
  }),
  Obj({
    below_top: IntNode({ min: -2032, max: 2031 })
  })
);

const Uniform = {
  min_inclusive: YOffset,
  max_inclusive: YOffset
};

const BiasedToBottom = Obj({
  ...Uniform,
  inner: IntNode({ min: 1, default: 1 })
});

export const HeightProvider = EitherNode(
  YOffset,
  SwitchNode(
    {
      uniform: Obj(Uniform),
      biased_to_bottom: BiasedToBottom,
      very_biased_to_bottom: BiasedToBottom,
      trapezoid: Obj({
        ...Uniform,
        plateau: IntNode({ default: 0 })
      }),
      constant: EitherNode(
        YOffset,
        Obj({
          value: YOffset
        })
      )
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
