import JSZip, { JSZipObject } from 'jszip';
import {
  isWorldgenRegistry,
  RegistryKey,
  Schema,
  WorldgenRegistryHolder,
  WorldgenRegistryKey
} from '../model/Registry';
import { isValidNamespace, isValidValue } from '../util/LabelHelper';
import { removeReactKeyReplacer } from '../util/DomHelper';

type ReadResult<T> = { [path: string]: T };
export class ZipAction {
  readonly errors: ReadResult<Error>;
  readonly registry: WorldgenRegistryHolder;
  private readonly zip: JSZip;

  private constructor(
    registry: WorldgenRegistryHolder,
    zip: JSZip,
    errors: ReadResult<Error> = {}
  ) {
    this.errors = errors;
    this.registry = registry;
    this.zip = zip;
  }

  static create(registry: WorldgenRegistryHolder): ZipAction {
    return new ZipAction(
      registry,
      new JSZip().file(
        'pack.mcmeta',
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
    );
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

      JSZip.loadAsync(file)
        .then((zip) => {
          extractDatapack(zip)
            .then(([holder, errors]) => {
              resolve(new ZipAction(holder, zip, errors));
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  generate(): Promise<Blob> {
    Object.entries(this.registry.worldgen).forEach(([registryKey, registry]) =>
      this.writeRegistry(registryKey as RegistryKey, registry.entries)
    );
    return this.zip.generateAsync({ type: 'blob' });
  }

  private writeRegistry(
    registryKey: RegistryKey,
    entries: Record<string, Schema>
  ) {
    for (const [namespacedKey, schema] of Object.entries(entries)) {
      const [folder, filename] = resourcePath(registryKey, namespacedKey);
      this.zip
        .folder(folder)
        ?.file(filename, JSON.stringify(schema, removeReactKeyReplacer, 2));
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
  zip: JSZip
): Promise<[WorldgenRegistryHolder, ReadResult<Error>]> {
  const pack = zip.file('pack.mcmeta');
  if (pack === null) {
    throw Error('Invalid datapack: no pack.mcmeta');
  }

  let mcmeta;
  try {
    mcmeta = JSON.parse(await pack.async('text')) as Partial<McMeta>;
  } catch (e) {
    throw Error(`Error reading pack.mcmeta file: ${e.message}`);
  }
  if (!mcmeta.pack || typeof mcmeta.pack.pack_format !== 'number') {
    throw Error('No pack format found in pack.mcmeta.');
  }

  const holder = new WorldgenRegistryHolder(mcmeta.pack.pack_format);
  const promises: Promise<Schema>[] = [];
  const paths: string[] = [];
  zip.forEach(function (path: string, entry: JSZipObject) {
    if (entry.dir) {
      return;
    }
    const match = findNamespacedKeyAndRegistry(entry.name);
    if (!match) {
      return;
    }

    promises.push(parseFile(holder, entry, ...match));
    paths.push(entry.name);
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
  entry: JSZipObject,
  namespace: string,
  key: string,
  registry: WorldgenRegistryKey
): Promise<Schema> {
  return entry.async('text').then((content) => {
    const schema = JSON.parse(content) as Record<string, unknown>;
    holder.register(registry, namespace + ':' + key, schema);
    return schema;
  });
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
