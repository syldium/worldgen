/* eslint-disable @typescript-eslint/ban-types */

import { isNode, ModelNode } from '../node/Node';
import {
  defaultNamespace,
  stripDefaultNamespace
} from '../../util/LabelHelper';
import type { WorldgenRegistryHolder } from '../Registry';
import type { ObjectOrNodeModel } from '../Model';
import type { WorldgenRegistryKey } from '../RegistryKey';

export function walkOnReferences(
  holder: WorldgenRegistryHolder,
  registryKey: WorldgenRegistryKey,
  resourceKey: string,
  callback: <P extends Record<string, unknown> | unknown[]>(
    parent: P,
    name: P extends object ? string : number,
    dependantRegistryKey: WorldgenRegistryKey,
    dependantRessourceKey: string
  ) => void
): number {
  const dependant = holder.graph[registryKey]?.[resourceKey];
  let size = 0;
  if (!dependant) {
    return size;
  }
  for (const [dependantRegistryKey, dependantResourceKeys] of Object.entries(
    dependant
  )) {
    const dependantRegistry =
      holder.worldgen[dependantRegistryKey as WorldgenRegistryKey];
    for (const dependantResourceKey of dependantResourceKeys) {
      selectReferences(
        holder,
        (
          parent,
          name,
          referenceRegistryKey,
          referenceResourceKey,
          dependantRegistryKey,
          dependantResourceKey
        ) => {
          if (
            referenceRegistryKey === registryKey &&
            referenceResourceKey === resourceKey
          ) {
            size++;
            callback(parent, name, dependantRegistryKey, dependantResourceKey);
          }
        },
        dependantRegistryKey,
        dependantRegistry.model.node,
        dependantRegistryKey as WorldgenRegistryKey,
        dependantResourceKey,
        dependantRegistry.entries[dependantResourceKey] as Record<
          string,
          unknown
        >
      );
    }
  }
  return size;
}

export type RefCallback = <T extends Record<string, unknown> | unknown[]>(
  parent: T,
  name: T extends object ? string : number,
  referenceRegistryKey: WorldgenRegistryKey,
  referenceResourceKey: string,
  dependantRegistryKey: WorldgenRegistryKey,
  dependantRessourceKey: string
) => void;
export function selectReferences(
  holder: WorldgenRegistryHolder,
  callback: RefCallback,
  name: string,
  node: ObjectOrNodeModel,
  registryKey: WorldgenRegistryKey,
  resourceKey: string,
  parent: Record<string, unknown>,
  obj = false
): void {
  if (isNode(node)) {
    const value = parent[name];
    switch (node.type) {
      case 'identifier':
      case 'resource': {
        if (!holder.isRegistered(node.registry)) {
          break;
        }
        if (isObject(value)) {
          selectReferences(
            holder,
            callback,
            name,
            holder.worldgen[node.registry].model.node,
            registryKey,
            resourceKey,
            value
          );
          break;
        }
        if (typeof value !== 'string') {
          break;
        }
        const referenceKey = defaultNamespace(value);
        callback(
          parent,
          name,
          node.registry,
          referenceKey,
          registryKey,
          resourceKey
        );
        break;
      }
      case 'list': {
        if (Array.isArray(value)) {
          for (const i in value) {
            selectReferences(
              holder,
              callback,
              i,
              node.of,
              registryKey,
              resourceKey,
              value as Record<number, unknown>
            );
          }
        }
        break;
      }
      case 'either': {
        const index = node.findCurrentIndex(value);
        if (index > -1) {
          selectReferences(
            holder,
            callback,
            name,
            node.nodes[index],
            registryKey,
            resourceKey,
            parent
          );
        }
        break;
      }
      case 'optional': {
        if (node.isValid(value)) {
          selectReferences(
            holder,
            callback,
            name,
            node.node,
            registryKey,
            resourceKey,
            parent
          );
        }
        break;
      }
      case 'switch': {
        const val = obj ? value : parent;
        if (!isObject(val)) {
          break;
        }
        const content = Array.isArray(val)
          ? (val[name] as Record<string, unknown>)
          : val;
        if (typeof val[node.typeField] !== 'string') {
          break;
        }
        const selection =
          node.values[stripDefaultNamespace(content[node.typeField] as string)];
        if (selection) {
          selectReferences(
            holder,
            callback,
            node.config || name,
            selection,
            registryKey,
            resourceKey,
            node.config === null ||
              (isNode(selection) && selection.type === 'resource')
              ? content
              : (val[node.config] as Record<string, unknown>)
          );
        }
        break;
      }
      case 'object': {
        if (isObject(value))
          selectReferencesObject(
            holder,
            callback,
            node.records,
            registryKey,
            resourceKey,
            value
          );
        break;
      }
    }
  } else {
    selectReferencesObject(
      holder,
      callback,
      node,
      registryKey,
      resourceKey,
      parent
    );
  }
}

function selectReferencesObject(
  holder: WorldgenRegistryHolder,
  callback: RefCallback,
  records: Record<string, ModelNode>,
  registryKey: WorldgenRegistryKey,
  resourceKey: string,
  parent: Record<string, unknown>
) {
  for (const [name, node] of Object.entries(records)) {
    if (name in parent) {
      selectReferences(
        holder,
        callback,
        name,
        node,
        registryKey,
        resourceKey,
        parent,
        true
      );
    }
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
