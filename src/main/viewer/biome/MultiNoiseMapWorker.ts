import {
  BiomeSource,
  CheckerboardBiomeSource,
  MultiNoiseBiomeSource
} from './BiomeSource';
import { ViewableBiomeSource } from './types';

declare const self: DedicatedWorkerGlobalScope;

export type BiomeColors = { [biome: string]: number };
interface WorkerMessage {
  workerId: number;
}
export interface RenderMessage extends WorkerMessage {
  action: 'render';
  tileId: string;
  id: string;
  x: number;
  z: number;
  scale: number;
}
export interface BiomeMessage extends WorkerMessage {
  action: 'biome';
  x: number;
  z: number;
}

export interface SettingsMessage extends WorkerMessage {
  action: 'settings';
  settings: ViewableBiomeSource;
  colors: BiomeColors;
}

interface RenderMessageResponse extends RenderMessage {
  pixels: ArrayBufferLike;
}

export type MapboundMessage =
  | { workerId: number; action: 'ready' }
  | {
    workerId: number;
    action: 'biome';
    x: number;
    z: number;
    biome: string;
    id: string;
  }
  | RenderMessageResponse;

export type WorkerboundMessage = SettingsMessage | RenderMessage | BiomeMessage;

let colors: BiomeColors = {};
let generator: null | BiomeSource = null;

self.onmessage = (event: MessageEvent<WorkerboundMessage>) => {
  const data = event.data;
  switch (data.action) {
    case 'settings': {
      const settings = data.settings;
      if (
        settings.type === 'multi_noise' ||
        settings.type === 'minecraft:multi_noise'
      ) {
        generator = new MultiNoiseBiomeSource(settings);
      } else {
        generator = new CheckerboardBiomeSource(settings as any);
      }
      colors = data.colors;
      self.postMessage({ action: 'ready', workerId: data.workerId });
      break;
    }
    case 'render': {
      const size = 64;
      const minZ = data.z * size;
      const minX = data.x * size;

      const biomes = [];
      for (let z = 0; z < size; z++) {
        for (let x = 0; x < size; x++) {
          const biome = generator!.getBiomeAt(
            (minX + x) << data.scale,
            0,
            (minZ + z) << data.scale
          );
          const color = colors[biome] || 0;
          biomes.push(color);
        }
      }

      const pixels = new Uint32Array(biomes).buffer;
      self.postMessage(
        {
          ...data,
          pixels
        } as RenderMessageResponse,
        [pixels]
      );
      break;
    }
    case 'biome':
      self.postMessage({
        ...data,
        biome: generator!.getBiomeAt(data.x, 0, data.z)
      });
  }
};
