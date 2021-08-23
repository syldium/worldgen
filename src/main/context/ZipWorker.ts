import { strFromU8, strToU8, Unzipped, unzipSync, zipSync } from 'fflate';
import { removeReactKeyReplacer } from '../util/DomHelper';
import { findNamespacedKeyAndRegistry, resourcePath } from '../util/PathHelper';
import type { McMeta, ReadResult } from './ZipAction';
import type { Schema } from '../model/Registry';
import type { WorldgenRegistryKey } from '../model/RegistryKey';

declare const self: DedicatedWorkerGlobalScope;

export type RawRegistries = {
  [registryKey in WorldgenRegistryKey]?: Record<string, Schema>;
};
export type ZipWorkerboundMessage =
  | { buffer: ArrayBuffer; action: 'extract' | 'unzip' }
  | { packMeta: McMeta; registries: RawRegistries; action: 'zip' }
  | { action: 'clear' };
export type ExtractDoneMessage = [RawRegistries, number];
export type UnzipDoneMessage = Unzipped;
export type ZipDoneMessage = Uint8Array;

let assets: Unzipped = {};

self.onmessage = ({ data }: MessageEvent<ZipWorkerboundMessage>) => {
  switch (data.action) {
    case 'extract':
    case 'unzip': {
      const unzipped = unzipSync(new Uint8Array(data.buffer));
      self.postMessage(
        data.action === 'extract' ? extractDatapack(unzipped) : unzipped
      );
      break;
    }
    case 'zip':
      self.postMessage(createDatapack(data.packMeta, data.registries));
      break;
    case 'clear':
      assets = {};
  }
};

function createDatapack(
  packMeta: McMeta,
  registries: RawRegistries
): Uint8Array {
  const data = Object.assign(
    { 'pack.mcmeta': strToU8(JSON.stringify(packMeta, null, 2)) },
    assets
  );
  for (const [registryKey, entries] of Object.entries(registries)) {
    for (const [resourceKey, schema] of Object.entries(entries)) {
      data[resourcePath(registryKey as WorldgenRegistryKey, resourceKey)] =
        strToU8(JSON.stringify(schema, removeReactKeyReplacer, 2));
    }
  }
  return zipSync(data);
}

function extractDatapack(unzipped: Unzipped): [RawRegistries, number] {
  const packMeta = unzipped['pack.mcmeta'];
  if (!packMeta) {
    throw Error('Invalid datapack: no pack.mcmeta');
  }

  let mcmeta;
  try {
    mcmeta = JSON.parse(strFromU8(packMeta)) as Partial<McMeta>;
  } catch (e) {
    throw Error(`Error reading pack.mcmeta file: ${e.message}`);
  }
  if (!mcmeta.pack || typeof mcmeta.pack.pack_format !== 'number') {
    throw Error('No pack format found in pack.mcmeta.');
  }

  assets = {};
  const errors: ReadResult<Error> = {};
  const registries: RawRegistries = {};
  for (const [path, entry] of Object.entries(unzipped)) {
    if (entry === packMeta) {
      continue;
    }

    const match = findNamespacedKeyAndRegistry(path);
    if (match) {
      const registryKey = match[2];
      try {
        const content = JSON.parse(strFromU8(entry)) as Schema;
        if (!(registryKey in registries)) {
          registries[registryKey] = {};
        }
        registries[registryKey]![`${match[0]}:${match[1]}`] = content;
      } catch (err) {
        errors[path] = err;
      }
    } else {
      assets[path] = entry;
    }
  }

  const failures = Object.keys(errors).length;
  if (failures) {
    console.error(errors);
  }
  return [registries, failures];
}

console.log('hi');
