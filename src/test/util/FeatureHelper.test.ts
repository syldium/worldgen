import {
  buildDecorated,
  DecoratedFeature,
  findDecorators
} from '../../main/util/FeatureHelper';
import type { Configured } from '../../main/model/Model';
import type { Obj } from '../../main/util/DomHelper';

type Feature = Configured & Obj;
describe('FeatureHelper', function () {
  it('should return self', () => {
    const input: Feature = { config: {}, type: 'empty' };
    const [decorators, feature] = findDecorators(input);
    expect(decorators).toHaveLength(0);
    expect(feature).toBe(input);
  });

  it('should return the nested decorated feature', () => {
    const offset = { config: { y: 5 }, type: 'offset' };
    const space = { config: {}, type: 'space' };
    const nested: DecoratedFeature = {
      config: { feature: 'should_be_decorated', decorator: offset },
      type: 'decorated'
    };
    const input: DecoratedFeature = {
      config: { feature: nested, decorator: space },
      type: 'minecraft:decorated'
    };
    const [decorators, feature] = findDecorators(input);
    expect(decorators).toEqual([space, offset]);
    expect(feature).toBe(nested);
  });

  it('should return the iceberg feature', () => {
    const chance: Feature = { config: { chance: 120 }, type: 'chance' };
    const iceberg: Feature = { config: {}, type: 'iceberg' };
    const input: Feature = {
      config: {
        feature: iceberg,
        decorator: chance
      },
      type: 'minecraft:decorated'
    };
    const [decorators, feature] = findDecorators(input);
    expect(decorators).toEqual([chance]);
    expect(feature).toBe(iceberg);
  });

  it('should return 3 decorators', () => {
    const [decorators, feature] = findDecorators(threeTimesDecoratedFeature);
    expect(decorators).toEqual(threeDecorators);
    expect(feature).toBe(cubicFeature);
  });

  it('should return the tree feature', () => {
    const count: Feature = { config: { count: 3 }, type: 'count' };
    const tree: Feature = {
      config: {
        trunk: {},
        leaves: {},
        decorator: { config: {}, type: 'submarine' }
      },
      type: 'tree'
    };
    const input: Feature = {
      config: {
        feature: tree,
        decorator: count
      },
      type: 'decorated'
    };
    const [decorators, feature] = findDecorators(input);
    expect(decorators).toEqual([count]);
    expect(feature).toBe(tree);
  });

  it("shouldn't create a decorated feature", () => {
    const feature: Feature = { config: { size: 5 }, type: 'island' };
    expect(buildDecorated(feature, [])).toBe(feature);
  });

  it('should create a decorated feature', () => {
    expect(buildDecorated(cubicFeature, threeDecorators)).toMatchObject(
      threeTimesDecoratedFeature
    );
  });
});

const countDecorator: Feature = { config: { count: 7 }, type: 'count' };
const decoratedDecorator: Feature = {
  config: {
    outer: {
      config: {},
      type: 'square'
    },
    inner: {
      config: {},
      type: 'heightmap'
    }
  },
  type: 'decorated'
};

const rangeDecorator: Feature = { config: { maximum: 64 }, type: 'range' };
const cubicFeature: Feature = { config: {}, type: 'cubic' };
const threeTimesDecoratedFeature: Feature = {
  config: {
    decorator: rangeDecorator,
    feature: {
      config: {
        decorator: decoratedDecorator,
        feature: {
          config: {
            decorator: countDecorator,
            feature: cubicFeature
          },
          type: 'minecraft:decorated'
        }
      },
      type: 'minecraft:decorated'
    }
  },
  type: 'minecraft:decorated'
};
const threeDecorators = [rangeDecorator, decoratedDecorator, countDecorator];
