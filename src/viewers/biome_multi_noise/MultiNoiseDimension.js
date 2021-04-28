import { DoublePerlinSampler } from './PerlinSamplers';
import { hashCode } from '../../utils/hash';
import Random from 'java-random';

/**
 * @typedef Biome
 * @type {object}
 * @property {string} biome Biome name 
 * @property {{
        temperature: number,
        humidity: number,
        altitude: number,
        weirdness: number,
        offset: number
    }} parameters Noise point parameters
 */

export class MultiNoiseDimension {

    /**
     * @param {{
            temperature_noise: { firstOctave: number, amplitudes: number[] },
            humidity_noise: { firstOctave: number, amplitudes: number[] },
            altitude_noise: { firstOctave: number, amplitudes: number[] },
            weirdness_noise: { firstOctave: number, amplitudes: number[] },
            seed: number,
            biomes: Biome[]
        }} source
    */
    constructor(source) {
        this.biomes = source.biomes;

        this.temperatureNoise = new DoublePerlinSampler(new Random(source.seed), source.temperature_noise);
        this.humidityNoise = new DoublePerlinSampler(new Random(source.seed + 1), source.humidity_noise);
        this.altitudeNoise = new DoublePerlinSampler(new Random(source.seed + 2), source.altitude_noise);
        this.weirdnessNoise = new DoublePerlinSampler(new Random(source.seed + 3), source.weirdness_noise);
    }

    /**
     * Get biome for the given block position.
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Biome}
     */
    getBiomeAt(x, y, z) {
        const biomeX = x >> 2;
        const biomeY = y >> 2;
        const biomeZ = z >> 2;

        // Calculate a noise point using perlin noise samplers
        const temperature = this.temperatureNoise.sample(biomeX, biomeY, biomeZ);
        const humidity = this.humidityNoise.sample(biomeX, biomeY, biomeZ);
        const altitude = this.altitudeNoise.sample(biomeX, biomeY, biomeZ);
        const weirdness = this.weirdnessNoise.sample(biomeX, biomeY, biomeZ);

        // Determine the biome with the parameters closest to the current noise point
        let current = null;
        let minDistance = Number.MAX_SAFE_INTEGER;
        for (const biome of this.biomes) {
            const distance = this.getDistanceToBiome(temperature, humidity, altitude, weirdness, biome.parameters);
            if (distance < minDistance) {
                current = biome;
                minDistance = distance;
            }
        }
        
        return current;
    }

    /**
     * Fill the image data with biome positions
     * 
     * @param {ImageData} image 
     * @param {number} [scale] exponential
     * @param {number} [every] x % every === 0 ? compute : use previous data
     * @param {number} [offsetX] 
     * @param {number} [offsetY] 
     */
    createImageData(image, scale = 4, every = 2, offsetX = 0, offsetY = 0) {
        const width = image.width;
        const height = image.height;
        const buffer = new ArrayBuffer(image.data.length);
        const buf8 = new Uint8ClampedArray(buffer);
        const data32 = new Uint32Array(buffer);

        const endX = offsetX + width;
        const endY = offsetY + height;

        const biomesColors = MultiNoiseDimension.getBiomesColors(this.biomes);

        let color = null;
        for (let x = offsetX; x < endX; x += 1) {
            for (let y = offsetY; y < endY; y += 1) {
                if (x % every === 0) {
                    if (y % every === 0) {
                        const biome = this.getBiomeAt(x << scale, 0, y << scale);
                        color = biomesColors[biome.biome];
                    }
                    data32[y * width + x] = (255 << 24) | color;
                } else {
                    data32[y * width + x] = data32[y * width + x - 1];
                }
            }
        }
        image.data.set(buf8);
    }

    /**
     * Calculates the distance from this noise point to another one.
     * 
     * @param {number} temperature 
     * @param {number} humidity 
     * @param {number} altitude 
     * @param {number} weirdness 
     * @param {{ temperature: number, humidity: number, altitude: number, weirdness: number, offset: number }} parameters 
     */
    getDistanceToBiome(temperature, humidity, altitude, weirdness, parameters) {
        return (temperature - parameters.temperature) ** 2
            + (humidity - parameters.humidity) ** 2
            + (altitude - parameters.altitude) ** 2
            + (weirdness - parameters.weirdness) ** 2
            + (0 - parameters.offset) ** 2;
    }

    /**
     * @param {Biome[]} biomes 
     * @returns {object}
     */
    static getBiomesColors(biomes = []) {
        const biomesColors = {};
        for (const biome of biomes) {
            biomesColors[biome.biome] = hashCode(biome.biome);
        }
        return biomesColors;
    }
}
