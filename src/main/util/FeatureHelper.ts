import { Configured } from '../model/Model';
import { Obj } from './DomHelper';

type Decorator = Configured & Obj;
type Feature = Configured & Obj;

interface DecoratedFeature extends Feature {
  config: {
    decorator: Decorator;
    feature: Feature;
  };
}

export function findDecorators(
  configuredFeature: Feature
): [Decorator[], Feature] {
  const decorators: Decorator[] = [];
  let feature = configuredFeature;

  while (feature && isDecoratedFeature(feature)) {
    decorators.push(feature.config.decorator);
    feature = feature.config.feature;
  }

  return [decorators, feature];
}

function isDecoratedFeature(feature: Feature): feature is DecoratedFeature {
  return feature.type === 'minecraft:decorated' || feature.type === 'decorated';
}

export function buildDecorated(
  feature: Feature,
  decorators: readonly Decorator[]
): Feature {
  if (decorators.length < 1) {
    return feature;
  }

  const decorated: Feature = { config: {}, type: 'minecraft:decorated' };
  let current = decorated;
  decorators.forEach((decorator, i) => {
    const f: Feature =
      i === decorators.length - 1
        ? feature
        : { config: {}, type: 'minecraft:decorated' };
    current.config = {
      feature: f,
      decorator
    };
    current = f;
  });
  return decorated;
}
