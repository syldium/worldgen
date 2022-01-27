import { del } from 'idb-keyval';
import { MouseEvent, useContext } from 'react';
import { Trash } from 'react-feather';
import { GameContext } from '../../context/GameRegistry';
import { useForceUpdate } from '../../hook/useForceUpdate';
import { WorldgenNames } from '../../model/Registry';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';
import { stripDefaultNamespace } from '../../util/LabelHelper';
import { resourcePath } from '../../util/PathHelper';
import { Link } from '../ui/Link';

interface ResourceListProps {
  registryKey: WorldgenRegistryKey;
}
export function ResourceList({ registryKey }: ResourceListProps): JSX.Element {
  const context = useContext(GameContext);
  const forceUpdate = useForceUpdate();
  const registry = context.worldgen!.worldgen[registryKey];
  const entries = Object.keys(registry.entries);
  const name = WorldgenNames[registryKey];

  const handleRemove = function (e: MouseEvent<HTMLElement>, key: string) {
    e.preventDefault();
    if (window.confirm('Do you really want to remove this resource?')) {
      registry.remove(key);
      del(resourcePath(registryKey, key)).then(forceUpdate);
    }
  };

  return (
    <div className="card">
      <h5>
        <strong>{entries.length}</strong> {name}
        {entries.length > 1 && !name.endsWith('s') && 's'}
      </h5>
      <ul>
        {entries.map((key) => {
          const name = stripDefaultNamespace(key, context.namespace);
          return (
            <li key={key}>
              <a href="#remove" onClick={(e) => handleRemove(e, key)}>
                <i className="delete">
                  <Trash />
                </i>
              </a>
              <Link href={`/${registryKey}/${key}`}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
