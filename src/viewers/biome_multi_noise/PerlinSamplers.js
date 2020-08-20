import { INT_MAX_VALUE, INT_MIN_VALUE, grad, lerp3, perlinFade } from '../../utils/math';

import Random from 'java-random';

export class DoublePerlinSampler {
    /**
     * @param {JavaRandom} random 
     * @param {{ firstOctave: number, amplitudes: number[] }} settings 
     */
    constructor(random, settings) {
        this.firstSampler = new OctaveSimplexNoise(random, settings);
        this.secondSampler = new OctaveSimplexNoise(random, settings);
        this.amplitude = this.createAmplitude(settings.amplitudes);
    }

    /**
     * @param {number[]} amplitudes 
     * @returns {number}
     */
    createAmplitude(amplitudes) {
        let a = INT_MAX_VALUE;
        let b = INT_MIN_VALUE;
        amplitudes.forEach((n, index) => {
            if (n !== 0) {
                a = Math.min(a, index);
                b = Math.max(b, index);
            }
        });
        return (1/6) / (0.1 * (1.0 + 1.0 / (b - a + 1)));
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    sample(x, y, z) {
        const d = x * 1.0181268882175227;
        const e = y * 1.0181268882175227;
        const f = z * 1.0181268882175227;
        return (this.firstSampler.sample(x, y, z) + this.secondSampler.sample(d, e, f)) * this.amplitude;
    }
}

class OctaveSimplexNoise {

    /**
     * @param {Random} random 
     * @param {number[]} octaves 
     */
    constructor(random, { firstOctave, amplitudes }) {
        this.amplitudes = amplitudes;
        const sampler = new PerlinNoiseSampler(random);
        const j = amplitudes.length;
        const k = -firstOctave;
        this.octaveSamplers = new Array(j);

        if (k >= 0 && k < j) {
            const d = amplitudes[k];
            if (d !== 0.0) {
                this.octaveSamplers[k] = sampler;
            }
        }

        for (let l = k - 1; l >= 0; --l) {
            if (l < j) {
                if (this.amplitudes[l] !== 0.0) {
                    this.octaveSamplers[l] = new PerlinNoiseSampler(random);
                } else {
                    consumeRandom(random, 262);
                }
            } else {
                consumeRandom(random, 262);
            }
        }

        if (k < j - 1) {
            const m = sampler.sample(0.0, 0.0, 0.0, 0.0, 0.0) * 9.223372036854776E18;
            const random2 = new Random(m);

            for (let n = k + 1; n < j; ++n) {
                if (n >= 0) {
                    if (this.amplitudes[n] !== 0.0) {
                        this.octaveSamplers[n] = new PerlinNoiseSampler(random2);
                    } else {
                        consumeRandom(random, 262);
                    }
                } else {
                    consumeRandom(random, 262);
                }
            }
        }

        this.lacunarity = Math.pow(2.0, -k);
        this.persistence = Math.pow(2.0, j - 1) / (Math.pow(2.0, j) - 1.0);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} d 
     * @param {number} e 
     * @param {boolean} bl 
     */
    sample(x, y, z, d = 0.0, e = 0.0, bl = false) {
        let noise = 0.0;
        let lacunarity = this.lacunarity;
        let persistence = this.persistence;

        this.octaveSamplers.forEach((sampler, i) => {
            if (typeof sampler === 'object') {
                noise += this.amplitudes[i] * sampler.sample(
                    x * lacunarity, bl ? -sampler.originY : y * lacunarity,
                    z * lacunarity,
                    d * lacunarity, e * lacunarity) * persistence;
                lacunarity *= 2.0;
                persistence /= 2.0;
            }
        });
        return noise;
    }
}

class PerlinNoiseSampler {

    /**
     * @param {Random} random 
     */
    constructor(random) {
        this.originX = random.nextDouble() * 256;
        this.originY = random.nextDouble() * 256;
        this.originZ = random.nextDouble() * 256;
        this.permutations = this.buildPermutationsTable(random);
    }

    /**
     * @param {Random} random 
     */
    buildPermutationsTable(random) {
        const permutations = new Uint8Array(256);
        for (let j = 0; j < 256; ++j) {
            permutations[j] = j;
        }
        for (let j = 0; j < 256; ++j) {
            const k = random.nextInt(256 - j);
            const b = permutations[j];
            permutations[j] = permutations[j + k];
            permutations[j + k] = b;
        }
        return permutations;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @param {number} d 
     * @param {number} e 
     * @returns {number}
     */
    sample(x, y, z, d, e) {
        const rx = x + this.originX;
        const ry = y + this.originY;
        const rz = z + this.originZ;
        const fx = Math.floor(rx);
        const fy = Math.floor(ry);
        const fz = Math.floor(rz);

        const dx = rx - fx;
        const dy = ry - fy;
        const dz = rz - fz;
        const fadeX = perlinFade(dx);
        const fadeY = perlinFade(dy);
        const fadeZ = perlinFade(dz);

        const t = d === 0 ? 0 : Math.floor(Math.min(e, dy) / d) * d;
        return this._sample(fx, fy, fz, dx, dy - t, dz, fadeX, fadeY, fadeZ);
    }

    /**
     * @param {number} sectionX 
     * @param {number} sectionY 
     * @param {number} sectionZ 
     * @param {number} localX 
     * @param {number} localY 
     * @param {number} localZ 
     * @param {number} fadeLocalX 
     * @param {number} fadeLocalY 
     * @param {number} fadeLocalZ 
     * @returns {number}
     */
    _sample(sectionX, sectionY, sectionZ, localX, localY, localZ, fadeLocalX, fadeLocalY, fadeLocalZ) {
        const i = this.getGradient(sectionX) + sectionY;
        const j = this.getGradient(i) + sectionZ;
        const k = this.getGradient(i + 1) + sectionZ;
        const l = this.getGradient(sectionX + 1) + sectionY;
        const m = this.getGradient(l) + sectionZ;
        const n = this.getGradient(l + 1) + sectionZ;
        const d = grad(this.getGradient(j), localX, localY, localZ);
        const e = grad(this.getGradient(m), localX - 1.0, localY, localZ);
        const f = grad(this.getGradient(k), localX, localY - 1.0, localZ);
        const g = grad(this.getGradient(n), localX - 1.0, localY - 1.0, localZ);
        const h = grad(this.getGradient(j + 1), localX, localY, localZ - 1.0);
        const o = grad(this.getGradient(m + 1), localX - 1.0, localY, localZ - 1.0);
        const p = grad(this.getGradient(k + 1), localX, localY - 1.0, localZ - 1.0);
        const q = grad(this.getGradient(n + 1), localX - 1.0, localY - 1.0, localZ - 1.0);
        return lerp3(fadeLocalX, fadeLocalY, fadeLocalZ, d, e, f, g, h, o, p, q);
    }

    getGradient(hash) {
        return this.permutations[hash & 255];
    }
}

/**
 * @param {Random} random 
 * @param {number} count
 */
function consumeRandom(random, count) {
    for (let c = 0; c < count; c++) {
        random.nextInt();
    }
}
