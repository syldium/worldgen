import { WorldgenNames } from '../../model/Registry';
import { MouseEvent, useContext } from 'react';
import { GameContext } from '../../context/GameRegistry';
import { stripDefaultNamespace } from '../../util/LabelHelper';
import { Trash } from 'react-feather';
import { useForceUpdate } from '../../hook/useForceUpdate';
import { Link } from 'react-router-dom';
import { del } from 'idb-keyval';
import { resourcePath } from '../../util/PathHelper';
import { removeDependency } from '../../model/graph/DependencyGraph';
import type { WorldgenRegistryKey } from '../../model/RegistryKey';

interface ResourceListProps {
  registryKey: WorldgenRegistryKey;
}
export function ResourceList({ registryKey }: ResourceListProps): JSX.Element {
  const context = useContext(GameContext);
  const worldgen = context.worldgen!;
  const forceUpdate = useForceUpdate();
  const registry = worldgen.worldgen[registryKey];
  const entries = Object.keys(registry.entries);
  const name = WorldgenNames[registryKey];

  const handleRemove = function (e: MouseEvent<HTMLElement>, key: string) {
    e.preventDefault();
    const dependant =
      registryKey in worldgen.graph ? worldgen.graph[registryKey]![key] : null;
    const dependantSize = dependant
      ? Object.values(dependant).reduce((acc, keys) => acc + keys.size, 0)
      : 0;
    const dependantText = dependant
      ? `\n${dependantSize} file${dependantSize > 1 ? 's' : ''} depend${
          dependantSize === 1 ? 's' : ''
        } on it.`
      : '';
    const text = 'Do you really want to remove this resource?' + dependantText;
    if (window.confirm(text)) {
      const leadsToNull = removeDependency(worldgen, registryKey, key);
      if (
        Object.keys(leadsToNull).length !== 0 &&
        window.confirm(
          'Would you like to delete recursively the now invalid resources?\nReferences found: ' +
            Object.values(leadsToNull)
              .reduce((acc, keys) => {
                acc.push(...keys);
                return acc;
              }, [] as string[])
              .join(', ')
        )
      ) {
        console.warn('Not implemented'); // TODO
      }
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
              <Link to={`/${registryKey}/${key}`}>{name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
