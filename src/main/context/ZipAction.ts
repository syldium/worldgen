import JSZip from 'jszip';
import { Schema, WorldgenRegistryHolder } from '../model/Registry';

export class ZipAction {
  private readonly registry: WorldgenRegistryHolder;
  private readonly zip: JSZip;

  constructor(registry: WorldgenRegistryHolder) {
    this.registry = registry;
    this.zip = new JSZip();
    this.zip.file(
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
    );

    Object.entries(registry.worldgen).forEach(([registryKey, registry]) =>
      this.writeRegistry(registryKey, registry.entries)
    );
  }

  generate(): Promise<Blob> {
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
