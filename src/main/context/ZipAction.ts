import type { Unzipped } from 'fflate';
import { RegistryHolder } from '../model/Registry';
import type { RegistryKey, WorldgenRegistryKey } from '../model/RegistryKey';
import type {
  ExtractDoneMessage,
  RawRegistries,
  UnzipDoneMessage,
  ZipDoneMessage,
  ZipWorkerboundMessage
} from './ZipWorker';
import ZipWorker from './ZipWorker?worker';

const worker = import.meta.env.SSR ? ({} as Worker) : new ZipWorker();
export type ReadResult<T> = { [path: string]: T };
export class ZipAction {
  /**
   * The number of files that could not be read.
   */
  readonly errors: number;

  /**
   * The registries associated with the datapack.
   */
  readonly registries: RegistryHolder;

  private constructor(registries: RegistryHolder, errors = 0) {
    this.errors = errors;
    this.registries = registries;
  }

  /**
   * Prepare to create a new .zip file.
   *
   * @param registries The worldgen registries
   */
  static create(registries: RegistryHolder): ZipAction {
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
          const holder = new RegistryHolder(data[0]);
          for (const [registryKey, entries] of Object.entries(data[1])) {
            const registry = holder.game[registryKey as RegistryKey];
            for (const entry of Object.entries(entries)) {
              registry.register(...entry);
            }
          }
          resolve(new ZipAction(holder, data[2]));
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
