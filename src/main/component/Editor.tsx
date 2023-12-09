import { ReactElement, useContext, useEffect, useState } from 'react';
import { GameContext } from '../context/GameRegistry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';
import { isValidNamespacedKey } from '../util/LabelHelper';
import { MainMenu } from './MainMenu';
import { ConfiguredFeature } from './resource/ConfiguredFeature';
import { Resource } from './resource/Resource';
import { NoRouteMatch } from './ui/NoRouteMatch';

interface EditorProps {
  location: string;
}

export function Editor({ location }: EditorProps): ReactElement {
  const [currentPath, setCurrentPath] = useState(location);
  const registries = useContext(GameContext).registries!;

  // Listen to page change
  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  // Split the uri, the first part is the registry key, the rest is the resource key
  const segments = currentPath.split('/').filter((s) => s !== '');
  if (!segments.length) {
    return <MainMenu />;
  }

  // Determine the registry key
  let registryKey: WorldgenRegistryKey | null = null;
  let subRegistry: string | null = null;
  if (registries.isWorldgen(segments[0])) {
    registryKey = segments[0];
  } else {
    subRegistry = segments[0] + '/' + segments[1];
    if (registries.isWorldgen(subRegistry)) {
      registryKey = subRegistry;
    }
  }

  // 404
  if (!registryKey) {
    return <NoRouteMatch />;
  }

  const resourceKey = segments.slice(subRegistry ? 2 : 1).join('/');
  if (!resourceKey || isValidNamespacedKey(resourceKey)) {
    if (registryKey === 'worldgen/configured_feature') {
      return <ConfiguredFeature id={resourceKey} />;
    } else {
      return (
        <Resource
          registryKey={registryKey}
          id={resourceKey}
          key={registryKey}
        />
      );
    }
  } else {
    return <NoRouteMatch />;
  }
}
