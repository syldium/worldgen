import { INT_MAX_VALUE, INT_MIN_VALUE } from '../../util/MathHelper';
import { Random } from '../random/Random';
import { NoiseSettings } from './types';

export class DoublePerlinSampler {
  private static DOMAIN_SCALE = 337 / 331;

  private readonly firstSampler: OctavePerlinNoise;
  private readonly secondSampler: OctavePerlinNoise;
  readonly amplitude: number;

  constructor(random: Random, settings: NoiseSettings) {
    this.firstSampler = new OctavePerlinNoise(random, settings);
    this.secondSampler = new OctavePerlinNoise(random, settings);
    this.amplitude = this.createAmplitude(settings.amplitudes);
  }

  sample(x: number, y: number, z: number): number {
    const bx = x * DoublePerlinSampler.DOMAIN_SCALE;
    const by = y * DoublePerlinSampler.DOMAIN_SCALE;
    const bz = z * DoublePerlinSampler.DOMAIN_SCALE;
    return (
      (this.firstSampler.sample(x, y, z) +
        this.secondSampler.sample(bx, by, bz)) *
      this.amplitude
    );
  }

  private createAmplitude(amplitudes: number[]) {
    let a = INT_MAX_VALUE;
    let b = INT_MIN_VALUE;
    amplitudes.forEach((n, index) => {
      if (n !== 0) {
        a = Math.min(a, index);
        b = Math.max(b, index);
      }
    });
    return 1 / 6 / (0.1 * (1 + 1 / (b - a + 1)));
  }
}

class OctavePerlinNoise {
  private readonly amplitudes: number[];
  private readonly octaveSamplers: PerlinNoiseSampler[];
  private readonly lacunarity: number;
  private readonly persistence: number;

  constructor(random: Random, { firstOctave, amplitudes }: NoiseSettings) {
    this.amplitudes = amplitudes;
    const sampler = new PerlinNoiseSampler(random);
    const length = amplitudes.length;
    const oppFirstOctave = -firstOctave;
    this.octaveSamplers = new Array(length);

    if (oppFirstOctave >= 0 && oppFirstOctave < length) {
      const d = amplitudes[oppFirstOctave];
      if (d !== 0) {
        this.octaveSamplers[oppFirstOctave] = sampler;
      }
    }

    for (let l = oppFirstOctave - 1; l >= 0; l--) {
      if (l < length) {
        if (this.amplitudes[l] !== 0) {
          this.octaveSamplers[l] = new PerlinNoiseSampler(random);
        } else {
          random.skip(262);
        }
      } else {
        random.skip(262);
      }
    }

    if (oppFirstOctave < length - 1) {
      const seed = sampler.sample(0, 0, 0, 0, 0) * 2 ** 63;
      const random2 = new Random(BigInt(seed));

      for (let n = oppFirstOctave + 1; n < length; n++) {
        if (n >= 0) {
          if (this.amplitudes[n] !== 0) {
            this.octaveSamplers[n] = new PerlinNoiseSampler(random2);
          } else {
            random.skip(262);
          }
        } else {
          random.skip(262);
        }
      }
    }

    this.lacunarity = Math.pow(2, -oppFirstOctave);
    this.persistence = Math.pow(2, length - 1) / (Math.pow(2, length) - 1);
  }

  sample(
    x: number,
    y: number,
    z: number,
    yScale = 0.0,
    yMax = 0.0,
    useOrigin = false
  ) {
    let noise = 0.0;
    let lacunarity = this.lacunarity;
    let persistence = this.persistence;

    this.octaveSamplers.forEach((sampler, i) => {
      if (sampler) {
        noise += this.amplitudes[i] *
          sampler.sample(
            x * lacunarity,
            useOrigin ? -sampler.originY : y * lacunarity,
            z * lacunarity,
            yScale * lacunarity,
            yMax * lacunarity
          ) *
          persistence;
        lacunarity *= 2.0;
        persistence /= 2.0;
      }
    });
    return noise;
  }
}

class PerlinNoiseSampler {
  readonly originX: number;
  readonly originY: number;
  readonly originZ: number;
  private readonly permutations: Uint8Array;

  constructor(random: Random) {
    this.originX = random.nextDouble() * 256;
    this.originY = random.nextDouble() * 256;
    this.originZ = random.nextDouble() * 256;

    this.permutations = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      this.permutations[i] = i;
    }
    for (let i = 0; i < 256; i++) {
      const k = random.nextInt(256 - i);
      const b = this.permutations[i];
      this.permutations[i] = this.permutations[i + k];
      this.permutations[i + k] = b;
    }
  }

  sample(x: number, y: number, z: number, yScale = 0, yMax = 0) {
    const rx = x + this.originX;
    const ry = y + this.originY;
    const rz = z + this.originZ;
    const fx = Math.floor(rx);
    const fy = Math.floor(ry);
    const fz = Math.floor(rz);
    const dx = rx - fx;
    const dy = ry - fy;
    const dz = rz - fz;

    let t = 0;
    if (yScale !== 0) {
      t = Math.floor(
        (yMax >= 0 && yMax < dy ? yMax : dy) / yScale + 1.0000000116860974e-7
      ) * yScale;
    }
    return this._sample(fx, fy, fz, dx, dy - t, dz, dy);
  }

  private _sample(
    sectionX: number,
    sectionY: number,
    sectionZ: number,
    localX: number,
    localY: number,
    localZ: number,
    fadeLocalX: number
  ): number {
    const x0 = this.getGradient(sectionX);
    const x1 = this.getGradient(sectionX + 1);
    const x0y0 = this.getGradient(x0 + sectionY);
    const x0y1 = this.getGradient(x0 + sectionY + 1);
    const x1y0 = this.getGradient(x1 + sectionY);
    const x1y1 = this.getGradient(x1 + sectionY + 1);
    const n000 = grad(
      this.getGradient(x0y0 + sectionZ),
      localX,
      localY,
      localZ
    );
    const n100 = grad(
      this.getGradient(x1y0 + sectionZ),
      localX - 1,
      localY,
      localZ
    );
    const n010 = grad(
      this.getGradient(x0y1 + sectionZ),
      localX,
      localY - 1,
      localZ
    );
    const n110 = grad(
      this.getGradient(x1y1 + sectionZ),
      localX - 1,
      localY - 1,
      localZ
    );
    const n001 = grad(
      this.getGradient(x0y0 + sectionZ + 1),
      localX,
      localY,
      localZ - 1
    );
    const n101 = grad(
      this.getGradient(x1y0 + sectionZ + 1),
      localX - 1,
      localY,
      localZ - 1
    );
    const n011 = grad(
      this.getGradient(x0y1 + sectionZ + 1),
      localX,
      localY - 1,
      localZ - 1
    );
    const n111 = grad(
      this.getGradient(x1y1 + sectionZ + 1),
      localX - 1,
      localY - 1,
      localZ - 1
    );
    const fadeX = perlinFade(localX);
    const fadeY = perlinFade(fadeLocalX);
    const fadeZ = perlinFade(localZ);
    return lerp3(
      fadeX,
      fadeY,
      fadeZ,
      n000,
      n100,
      n010,
      n110,
      n001,
      n101,
      n011,
      n111
    );
  }

  getGradient(hash: number): number {
    return this.permutations[hash & 255];
  }
}

function grad(hash: number, x: number, y: number, z: number): number {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}
function lerp(delta: number, start: number, end: number) {
  return start + delta * (end - start);
}

function lerp2(
  deltaX: number,
  deltaY: number,
  n00: number,
  n10: number,
  n01: number,
  n11: number
) {
  return lerp(deltaY, lerp(deltaX, n00, n10), lerp(deltaX, n01, n11));
}

function lerp3(
  deltaX: number,
  deltaY: number,
  deltaZ: number,
  n000: number,
  n100: number,
  n010: number,
  n110: number,
  n001: number,
  n101: number,
  n011: number,
  n111: number
) {
  return lerp(
    deltaZ,
    lerp2(deltaX, deltaY, n000, n100, n010, n110),
    lerp2(deltaX, deltaY, n001, n101, n011, n111)
  );
}
function perlinFade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
