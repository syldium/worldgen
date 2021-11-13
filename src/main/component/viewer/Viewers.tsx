import React, { Suspense } from 'react';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';
import { stripDefaultNamespace } from '../../util/LabelHelper';

export interface ViewerProps {
  value: any;
}

interface Viewer {
  key: string;
  predicate: (value: Record<string, any>) => boolean;
  component: React.LazyExoticComponent<React.NamedExoticComponent<ViewerProps>>;
}

let Viewers: Partial<Record<WorldgenRegistryKey, ReadonlyArray<Viewer>>>;
if (!import.meta.env.SSR) {
  const BiomeSourceMap: Viewer = {
    key: 'BiomeSourceMap',
    predicate: (value) => {
      if (typeof value.type !== 'string') {
        return false;
      }
      const type = stripDefaultNamespace(value.type);
      return (
        (type === 'multi_noise' || type === 'checkerboard') &&
        Array.isArray(value.biomes) &&
        value.biomes.length > 0 &&
        'seed' in value
      );
    },
    component: React.lazy(() => import('./BiomeSourceMap'))
  };
  Viewers = {
    'worldgen/biome_source': [BiomeSourceMap]
  };
} else {
  Viewers = {};
}
export default Viewers;

export function ViewerElement(
  registry: WorldgenRegistryKey,
  resource: Record<string, unknown>
): JSX.Element | null {
  const viewers = Viewers[registry]?.filter((viewer) =>
    viewer.predicate(resource)
  );
  if (viewers && viewers.length) {
    return (
      <div className="viewers">
        {viewers.map((viewer) => (
          <Suspense fallback={<div>Loading...</div>} key={viewer.key}>
            {React.createElement(viewer.component, { value: resource })}
          </Suspense>
        ))}
      </div>
    );
  }
  return null;
}
