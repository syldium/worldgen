import { WorldgenRegistryHolder } from '../model/Registry';
import ZipWorker from './ZipWorker?worker';
import type {
  ExtractDoneMessage,
  RawRegistries,
  UnzipDoneMessage,
  ZipDoneMessage,
  ZipWorkerboundMessage
} from './ZipWorker';
import type { Unzipped } from 'fflate';
import type { WorldgenRegistryKey } from '../model/RegistryKey';

const worker = new ZipWorker();
export type ReadResult<T> = { [path: string]: T };
export class ZipAction {
  /**
   * The number of files that could not be read.
   */
  readonly errors: number;

  /**
   * The registries associated with the datapack.
   */
  readonly registries: WorldgenRegistryHolder;

  private constructor(registries: WorldgenRegistryHolder, errors = 0) {
    this.errors = errors;
    this.registries = registries;
  }

  /**
   * Prepare to create a new .zip file.
   *
   * @param registries The worldgen registries
   */
  static create(registries: WorldgenRegistryHolder): ZipAction {
    return new ZipAction(registries);
  }

  /**
   * Read the file for compatible resources.
   *
   * The assets will be kept by the worker to be restored if a new .zip file is created.
   *
   * @param file The file to read
   */
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
        const buffer = reader.result as ArrayBuffer;
        worker.onmessage = ({ data }: MessageEvent<ExtractDoneMessage>) => {
          const holder = new WorldgenRegistryHolder(7);
          for (const [registryKey, entries] of Object.entries(data[0])) {
            const registry =
              holder.worldgen[registryKey as WorldgenRegistryKey];
            for (const entry of Object.entries(entries)) {
              registry.register(...entry);
            }
          }
          resolve(new ZipAction(holder, data[1]));
        };
        worker.onerror = ({ message }: ErrorEvent) => reject(message);
        worker.postMessage(
          { buffer, action: 'extract' } as ZipWorkerboundMessage,
          [buffer]
        );
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Removes assets from the memory of the worker.
   */
  static clearWorker(): void {
    worker.postMessage({ action: 'clear' } as ZipWorkerboundMessage);
  }

  static unzip(buffer: ArrayBuffer): Promise<Unzipped> {
    const promise = new Promise<Unzipped>((resolve, reject) => {
      worker.onmessage = ({ data }: MessageEvent<UnzipDoneMessage>) =>
        resolve(data);
      worker.onerror = ({ message }: ErrorEvent) => reject(message);
    });
    worker.postMessage({ buffer, action: 'unzip' } as ZipWorkerboundMessage, [
      buffer
    ]);
    return promise;
  }

  async generate(): Promise<Blob> {
    const registries: RawRegistries = {};
    Object.entries(this.registries.worldgen).forEach(
      ([registryKey, registry]) => {
        registries[registryKey as WorldgenRegistryKey] = registry.entries;
      }
    );
    const promise = new Promise<Blob>((resolve, reject) => {
      worker.onmessage = ({ data }: MessageEvent<ZipDoneMessage>) =>
        resolve(new Blob([data]));
      worker.onerror = ({ message }: ErrorEvent) => reject(message);
    });
    worker.postMessage({
      packMeta: {
        pack: {
          pack_format: this.registries.packFormat,
          description: 'Custom biome'
        }
      },
      registries,
      action: 'zip'
    } as ZipWorkerboundMessage);
    return promise;
  }
}
export default ZipAction;

export interface McMeta {
  pack: {
    description: string;
    pack_format: number;
  };
}
