const namespace = '%namespace%';
export const PATHS = {
    dimensions: `data/${namespace}/dimension`,
    dimension_types: `data/${namespace}/dimension_type`,
    biomes: `data/${namespace}/worldgen/biome`,
    carvers: `data/${namespace}/worldgen/configured_carver`,
    features: `data/${namespace}/worldgen/configured_feature`,
    surfaces: `data/${namespace}/worldgen/configured_surface_builder`,
    noises: `data/${namespace}/worldgen/noise_settings`,
    processors: `data/${namespace}/worldgen/processor_list`
};

/**
 * @param {('dimensions'|'dimension_types'|'biomes'|'carvers'|'features'|'surfaces'|'noises'|'processors')} type 
 * @param {string} namespace 
 * @param {string} identifier 
 * @returns {string}
 */
export function getAbsolutePath(type, namespace, identifier) {
    return PATHS[type].replace('%namespace%', namespace) + '/' + identifier + '.json';
}
