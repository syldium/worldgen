import { selectReferences, walkOnReferences } from './ReferenceWalker';
import type { RefCallback } from './ReferenceWalker';
import type { Schema, WorldgenRegistryHolder } from '../Registry';
import type { WorldgenRegistryKey } from '../RegistryKey';

/**
 * A set of dependants resources by registry.
 */
export type Dependants = { [registry in WorldgenRegistryKey]?: Set<string> };

/**
 * For each resource, list its dependencies.
 */
export type DependencyGraph = {
  [registry in WorldgenRegistryKey]?: { [dependency: string]: Dependants };
};

function addToDependants(
  dependants: Dependants,
  registryKey: WorldgenRegistryKey,
  resourceKey: string
) {
  if (!(registryKey in dependants)) {
    dependants[registryKey] = new Set();
  }
  dependants[registryKey]!.add(resourceKey);
}

/**
 * Create the callback of {@link #selectReferences} when building a complete graph.
 *
 * @param graph
 */
const createGraph =
  (graph: DependencyGraph): RefCallback =>
  (
    parent,
    name,
    referenceRegistryKey,
    referenceResourceKey,
    registryKey,
    resourceKey
  ) => {
    // Init the previous properties if they do not exist.
    if (!(referenceRegistryKey in graph)) {
      graph[referenceRegistryKey] = {};
    }
    if (!(referenceResourceKey in graph[referenceRegistryKey]!)) {
      graph[referenceRegistryKey]![referenceResourceKey] = {};
    }
    addToDependants(
      graph[referenceRegistryKey]![referenceResourceKey],
      registryKey,
      resourceKey
    );
  };

/**
 * Create the callback of {@link #selectReferences} when building the dependencies set.
 *
 * @param graph
 */
const createDependenciesGraph =
  (graph: Dependants): RefCallback =>
  (parent, name, referenceRegistryKey, referenceResourceKey) => {
    addToDependants(graph, referenceRegistryKey, referenceResourceKey);
  };

/**
 * Analyze the whole registry holder and determines the dependency graph.
 *
 * @param holder
 */
export function analyzeDependencies(
  holder: WorldgenRegistryHolder
): DependencyGraph {
  const graph: DependencyGraph = {};
  const callback = createGraph(graph);
  for (const [registryKey, registry] of holder.entries) {
    const model = registry.model.node;
    for (const [resourceKey, entry] of Object.entries(registry.entries)) {
      selectReferences(
        holder,
        callback,
        resourceKey,
        model,
        registryKey,
        resourceKey,
        entry as Record<string, unknown>
      );
    }
  }
  return graph;
}

/**
 * Create a dependency graph for a single resource.
 *
 * @param holder
 * @param registryKey
 * @param resourceKey
 * @param schema
 */
function localGraph(
  holder: WorldgenRegistryHolder,
  registryKey: WorldgenRegistryKey,
  resourceKey: string,
  schema: Schema
): Dependants {
  const graph: Dependants = {};
  selectReferences(
    holder,
    createDependenciesGraph(graph),
    resourceKey,
    holder.worldgen[registryKey].model.node,
    registryKey,
    resourceKey,
    schema as Record<string, unknown>
  );
  return graph;
}

/**
 * Update only a part of the dependency graph.
 *
 * @param holder The registries
 * @param registryKey The registry key of the resource
 * @param resourceKey The resource key
 * @param prevSchema The previous schema
 * @param nextSchema The next schema
 */
export function updateDependencyGraph(
  holder: WorldgenRegistryHolder,
  registryKey: WorldgenRegistryKey,
  resourceKey: string,
  prevSchema: Schema | undefined,
  nextSchema: Schema
): void {
  // Create a dependency graph for each version
  const prev = prevSchema
    ? localGraph(holder, registryKey, resourceKey, prevSchema)
    : {};
  const next = localGraph(holder, registryKey, resourceKey, nextSchema);

  // Look for dependencies that have been removed
  for (const [prevRegistryKey, prevResourceKeys] of Object.entries(prev)) {
    const key = prevRegistryKey as WorldgenRegistryKey;
    const subGraph = holder.graph[key];
    if (!subGraph) continue; // The dependency is not in the tree, should not happen if it's updated every time.

    for (const dependency of prevResourceKeys) {
      const removed = !next[key]?.has(dependency);
      if (removed) {
        const dependants = subGraph[dependency]?.[registryKey];
        if (!dependants) continue;

        dependants.delete(resourceKey);
        if (dependants.size === 0) {
          delete subGraph[dependency][registryKey];
          if (Object.keys(dependants).length === 0) {
            delete subGraph[dependency];
          }
        }
      }
    }
  }

  // Look for dependencies that have been added
  for (const [nextRegistryKey, nextResourceKeys] of Object.entries(next)) {
    const rKey = nextRegistryKey as WorldgenRegistryKey;
    if (!(rKey in holder.graph)) {
      holder.graph[rKey] = {};
    }
    const subGraph = holder.graph[rKey]!;
    for (const dependency of nextResourceKeys) {
      if (!(dependency in subGraph)) {
        subGraph[dependency] = {};
      }
      addToDependants(subGraph[dependency], registryKey, resourceKey);
    }
  }
}

/**
 * Rename a resource key in the graph only.
 *
 * @param holder
 * @param registryKey
 * @param prevResourceKey
 * @param nextResourceKey
 * @return {number} Number of changed references
 */
export function renameDependency(
  holder: WorldgenRegistryHolder,
  registryKey: WorldgenRegistryKey,
  prevResourceKey: string,
  nextResourceKey: string
): number {
  const size = walkOnReferences(
    holder,
    registryKey,
    prevResourceKey,
    // @ts-ignore
    (parent, name) => (parent[name] = nextResourceKey)
  );
  if (size !== 0) {
    const graph = holder.graph[registryKey]!;
    if (nextResourceKey) {
      graph[nextResourceKey] = graph[prevResourceKey];
    }
    delete graph[prevResourceKey];
  }
  return size;
}

/**
 * Remove a resource key on the graph only.
 *
 * @param holder
 * @param registryKey
 * @param resourceKey
 * @return {Dependants} The resources that depend on it that now point to an invalid value.
 */
export function removeDependency(
  holder: WorldgenRegistryHolder,
  registryKey: WorldgenRegistryKey,
  resourceKey: string
): Dependants {
  const leadsToNull: Dependants = {};
  walkOnReferences(
    holder,
    registryKey,
    resourceKey,
    (parent, name, registryKey, resourceKey) => {
      if (Array.isArray(parent)) {
        // On arrays, we can "safely" remove the item, this is usually for the biome features field.
        parent.splice(name as number, 1);
      } else {
        // We don't have a fallback, we can only save the invalid reference.
        addToDependants(leadsToNull, registryKey, resourceKey);
      }
    }
  );

  const dependants = holder.graph[registryKey]?.[resourceKey];
  if (!dependants) {
    // The graph does not need to be updated.
    return leadsToNull;
  }
  let empty = true; // If there are no invalid dependent resources.
  for (const [dependantRegistryKey, dependantResourceKeys] of Object.entries(
    dependants
  )) {
    for (const dependantResourceKey of dependantResourceKeys) {
      if (
        dependantRegistryKey in leadsToNull &&
        leadsToNull[dependantRegistryKey as WorldgenRegistryKey]!.has(
          dependantResourceKey
        )
      ) {
        empty = false;
      } else {
        dependantResourceKeys.delete(dependantResourceKey);
      }
    }
  }
  if (empty) {
    // The set of dependants is now empty and useless.
    delete holder.graph[registryKey]![resourceKey];
  }
  return leadsToNull;
}
