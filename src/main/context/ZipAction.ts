import {
  isWorldgenRegistry,
  RegistryKey,
  Schema,
  WorldgenRegistryHolder,
  WorldgenRegistryKey
} from '../model/Registry';
import { isValidNamespace, isValidValue } from '../util/LabelHelper';
import { removeReactKeyReplacer } from '../util/DomHelper';
import { strFromU8, strToU8, Unzipped, unzipSync, zipSync } from 'fflate';

type ReadResult<T> = { [path: string]: T };
export class ZipAction {
  readonly errors: ReadResult<Error>;
  readonly registry: WorldgenRegistryHolder;
  private readonly zip: Unzipped;

  private constructor(
    registry: WorldgenRegistryHolder,
    zip: Unzipped,
    errors: ReadResult<Error> = {}
  ) {
    this.errors = errors;
    this.registry = registry;
    this.zip = zip;
  }

  static create(registry: WorldgenRegistryHolder): ZipAction {
    return new ZipAction(registry, {
      'pack.mcmeta': strToU8(
        JSON.stringify(
          {
            pack: {
              pack_format: registry.packFormat,
              description: 'Custom biome'
            }
          } as McMeta,
          null,
          2
        )
      )
    });
  }

  static async read(file: File): Promise<ZipAction> {
    return new Promise((resolve, reject) => {
      if (
        ![
          'application/zip',
          'application/octet-stream',
          'application/x-zip-compressed',
          'multipart/x-zip'
        ].includes(file.type)
      ) {
        reject(new Error(`File is not a .zip. Got: ${file.type}`));
      }

      const reader = new FileReader();
      reader.onload = () => {
        const zip = unzipSync(new Uint8Array(reader.result as ArrayBuffer));
        extractDatapack(zip)
          .then(([holder, errors]) => {
            resolve(new ZipAction(holder, zip, errors));
          })
          .catch(reject);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async generate(): Promise<Blob> {
    Object.entries(this.registry.worldgen).forEach(([registryKey, registry]) =>
      this.writeRegistry(registryKey as RegistryKey, registry.entries)
    );
    return new Blob([zipSync(this.zip)]);
  }

  private writeRegistry(
    registryKey: RegistryKey,
    entries: Record<string, Schema>
  ) {
    for (const [namespacedKey, schema] of Object.entries(entries)) {
      const path = resourcePath(registryKey, namespacedKey).join('/');
      this.zip[path] = strToU8(
        JSON.stringify(schema, removeReactKeyReplacer, 2)
      );
    }
  }
}

interface McMeta {
  pack: {
    description: string;
    pack_format: number;
  };
}
async function extractDatapack(
  zip: Unzipped
): Promise<[WorldgenRegistryHolder, ReadResult<Error>]> {
  const pack = zip['pack.mcmeta'];
  if (!pack) {
    throw Error('Invalid datapack: no pack.mcmeta');
  }

  let mcmeta;
  try {
    mcmeta = JSON.parse(strFromU8(pack)) as Partial<McMeta>;
  } catch (e) {
    throw Error(`Error reading pack.mcmeta file: ${e.message}`);
  }
  if (!mcmeta.pack || typeof mcmeta.pack.pack_format !== 'number') {
    throw Error('No pack format found in pack.mcmeta.');
  }

  const holder = new WorldgenRegistryHolder(mcmeta.pack.pack_format);
  const promises: Promise<Schema>[] = [];
  const paths: string[] = [];
  Object.entries(zip).forEach(function ([path, entry]) {
    const match = findNamespacedKeyAndRegistry(path);
    if (!match) {
      return;
    }

    promises.push(parseFile(holder, entry, ...match));
    paths.push(path);
  });

  return [
    holder,
    await Promise.allSettled(promises).then((results) =>
      results.reduce((errors, result, index) => {
        if (result.status === 'rejected') {
          errors[paths[index]] = result.reason;
        }
        return errors;
      }, {} as ReadResult<Error>)
    )
  ];
}

async function parseFile(
  holder: WorldgenRegistryHolder,
  entry: Uint8Array,
  namespace: string,
  key: string,
  registry: WorldgenRegistryKey
): Promise<Schema> {
  const content = strFromU8(entry);
  const schema = JSON.parse(content) as Record<string, unknown>;
  holder.register(registry, namespace + ':' + key, schema);
  return schema;
}

export function resourcePath(
  registryKey: RegistryKey,
  resourceKey: string
): [string, string] {
  const [namespace, filename] = resourceKey.split(':');
  return [`data/${namespace}/${registryKey}`, `${filename}.json`];
}

export function findNamespacedKeyAndRegistry(
  path: string
): [string, string, WorldgenRegistryKey] | null {
  const filenames = path.split('/');
  if (filenames.length < 4 || filenames[0] !== 'data') {
    return null;
  }
  if (!isValidNamespace(filenames[1])) {
    return null;
  }

  let registry: WorldgenRegistryKey | null = null;
  let subRegistry: string | null = null;
  if (isWorldgenRegistry(filenames[2])) {
    registry = filenames[2];
  } else {
    subRegistry = filenames[2] + '/' + filenames[3];
    if (isWorldgenRegistry(subRegistry)) {
      registry = subRegistry;
    }
  }
  if (!registry) {
    return null;
  }

  let key = filenames.slice(subRegistry ? 4 : 3).join('/');
  if (!key.endsWith('.json')) {
    return null;
  }
  key = key.substr(0, key.length - '.json'.length);
  if (!isValidValue(key)) {
    return null;
  }
  return [filenames[1], key, registry];
}
