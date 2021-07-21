import JSZip from 'jszip';
import { Schema, WorldgenRegistryHolder } from '../model/Registry';

export class ZipAction {
  readonly errors: Error[];
  readonly registry: WorldgenRegistryHolder;
  private readonly zip: JSZip;

  private constructor(
    registry: WorldgenRegistryHolder,
    zip: JSZip,
    errors: Error[] = []
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
          },
          null,
          2
        )
      )
    );
  }

    Object.entries(registry.worldgen).forEach(([registryKey, registry]) =>
      this.writeRegistry(registryKey, registry.entries)
    );
  }

  generate(): Promise<Blob> {
    Object.entries(this.registry.worldgen).forEach(([registryKey, registry]) =>
      this.writeRegistry(registryKey, registry.entries)
    );
    return this.zip.generateAsync({ type: 'blob' });
  }

  private writeRegistry(registryKey: string, entries: Record<string, Schema>) {
    for (const [namespacedKey, schema] of Object.entries(entries)) {
      const [namespace, filename] = namespacedKey.split(':');
      this.zip
        .folder(`data/${namespace}/${registryKey}`)
        ?.file(filename + '.json', JSON.stringify(schema, null, 2));
    }
  }
}
