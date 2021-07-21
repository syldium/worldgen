// @ts-ignore
import MapWorker from './MultiNoiseMapWorker?worker';
import { Coords, DoneCallback, GridLayer } from 'leaflet';
import {
  BiomeColors,
  BiomeMessage,
  MapboundMessage,
  RenderMessage,
  SettingsMessage
} from './MultiNoiseMapWorker';
import { BiomeParameters, ViewableBiomeSource } from './types';
import VanillaBiomeColors from 'biome-colors';
import { stripDefaultNamespace } from '../../util/LabelHelper';

interface IQueueItem<D extends boolean> {
  multiple: D; // The item type
  id: string; // An id used for BiomeSourceMapLayer#messages
}
interface BiomeQueueItem
  extends Omit<BiomeMessage, 'workerId'>,
    IQueueItem<false> {
  done: (biome: string) => void;
}
interface CanvasQueueItem
  extends Omit<RenderMessage, 'workerId'>,
    IQueueItem<true> {
  canvas: HTMLCanvasElement; // The canvas with a 2d context
  done: DoneCallback;
}
type QueueItem = BiomeQueueItem | CanvasQueueItem;

export class BiomeSourceMapLayer extends GridLayer {
  private free: number[] = [];
  private readonly workers: Worker[] = [];
  private readonly queue: QueueItem[] = [];
  private readonly messages: { [tileId: string]: QueueItem } = {};
  private colors: BiomeColors = {};

  constructor(
    numWorkers: number,
    settings?: ViewableBiomeSource,
    colors?: BiomeColors
  ) {
    super();
    for (let workerId = 0; workerId < numWorkers; workerId++) {
      const worker = new MapWorker();
      worker.onmessage = (event: MessageEvent<MapboundMessage>) => {
        const data = event.data;

        // Process queue
        if (this.queue.length) {
          this.post(this.queue.shift()!, data.workerId);
        } else {
          this.free.push(data.workerId);
        }
        if (data.action === 'ready') return;

        const msg = this.messages[data.id];
        if (!msg) return;
        if (data.action === 'render') {
          if (!msg.multiple) return;
          const ctx = msg.canvas.getContext('2d')!;
          const img = ctx.createImageData(64, 64);
          img.data.set(new Uint8Array(data.pixels));
          ctx.putImageData(img, 0, 0);
          msg.done();
        } else {
          if (msg.multiple) return;
          msg.done(data.biome);
        }
      };
      this.workers.push(worker);
    }
    if (settings) {
      this.setSettings(settings, colors);
    }
  }

  setSettings(settings: ViewableBiomeSource, colors: BiomeColors = {}): void {
    this.colors = Object.assign(colors, VanillaBiomeColors);
    this.free = [];
    this.workers.forEach((worker, workerId) =>
      worker.postMessage({
        action: 'settings',
        settings: removeNamespaceBiomes(settings),
        colors: this.colors,
        workerId
      } as SettingsMessage)
    );
  }

  getColors(): BiomeColors {
    return this.colors;
  }

  remove(): this {
    this.workers.forEach((worker) => worker.terminate());
    return super.remove();
  }

  getBiomeAt(x: number, z: number, done: (biome: string) => void): void {
    this.delay({
      action: 'biome',
      x,
      z,
      done,
      id: x + ':' + z,
      multiple: false
    });
  }

  private delay(item: QueueItem) {
    if (this.free.length) {
      this.post(item, this.free.pop()!);
    } else {
      this.queue.push(item);
    }
  }

  private post(item: QueueItem, workerId: number) {
    this.messages[item.id] = item;
    const message = Object.assign({ workerId }, item, {
      canvas: undefined,
      done: undefined
    });
    this.workers[workerId].postMessage(message);
  }

  protected createTile(coords: Coords, done: DoneCallback): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const tileId = this._tileCoordsToKey(coords);
    this.delay({
      action: 'render',
      x: coords.x,
      z: coords.y,
      scale: 10 - coords.z,
      canvas,
      done,
      id: tileId,
      tileId,
      multiple: true
    });
    return canvas;
  }
}

export const removeNamespaceBiomes = (
  source: ViewableBiomeSource
): ViewableBiomeSource => ({
  ...source,
  biomes: source.biomes.map(strip) as never[]
});

function strip(biome: string | BiomeParameters): typeof biome {
  if (typeof biome === 'string') {
    return stripDefaultNamespace(biome);
  }
  return { ...biome, biome: stripDefaultNamespace(biome.biome) };
}
