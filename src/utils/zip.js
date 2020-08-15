import JSZip from "jszip";
import { saveAs } from "file-saver";
import { dataUpper } from "./data";

const DIMENSIONS_PATH = /^data\/([a-z0-9._-]+)\/(dimension|dimension_type)\/([a-z0-9._-]+).json$/;
const WORLDGEN_PATH = /^data\/([a-z0-9._-]+)\/worldgen\/(biome|configured_carver|configured_feature|configured_surface_builder|noise_settings)\/([a-z0-9._-]+).json$/;

const LEGACY_DIMENSIONS_PATH = /^data\/minecraft\/(dimension|dimension_type)\/([a-z0-9._-]+)\/([a-z0-9._-]+).json$/;
const LEGACY_WORLDGEN_PATH = /^data\/minecraft\/worldgen\/(biome|configured_carver|configured_feature|configured_surface_builder|noise_settings)\/([a-z0-9._-]+)\/([a-z0-9._-]+).json$/;

/**
 * Build zip in blob.
 * 
 * @param {{ biomes: object[], carvers: object[], dimensions: object[], dimension_types: object[], features: object[], noises: object[], surfaces: object[] }} custom 
 */
export function buildZip(custom) {
    const zip = new JSZip();

    let modified;
    if (custom.dimensions.length > 0) {
        modified = 'dimension';
    } else if (custom.biomes.length > 0) {
        modified = 'biome';
    } else {
        modified = (Object.entries(custom).find(([type, elements]) => typeof elements !== 'function' && elements.length > 0) || [''])[0];
    }
    
    zip.file('pack.mcmeta', JSON.stringify({
        pack: {
            pack_format: 6,
            description: 'Custom ' + modified
        }
    }, null, 4));
    const namespace = '%namespace%';
    writeFile(zip, `data/${namespace}/dimension`, custom.dimensions);
    writeFile(zip, `data/${namespace}/dimension_type`, custom.dimension_types);
    writeFile(zip, `data/${namespace}/worldgen/biome`, custom.biomes);
    writeFile(zip, `data/${namespace}/worldgen/configured_carver`, custom.carvers);
    writeFile(zip, `data/${namespace}/worldgen/configured_feature`, custom.features);
    writeFile(zip, `data/${namespace}/worldgen/configured_surface_builder`, custom.surfaces);
    writeFile(zip, `data/${namespace}/worldgen/noise_settings`, custom.noises);
    zip.generateAsync({ type: 'blob' })
        .then(function(content) {
            saveAs(content, 'generated_datapack.zip');
        });
}

/**
 * @param {File} file
 * @returns {Promise<[string, { biomes: object[], dimensions: object[], features: object[], surfaces: object[] }]>}
 */
export function readZip(file) {
    return new Promise((resolve, reject) => {
        if (!['application/zip', 'application/octet-stream', 'application/x-zip-compressed', 'multipart/x-zip'].includes(file.type)) {
             reject(new Error(`File is not a .zip. Got: ${file.type}`));
        }

        JSZip.loadAsync(file).then((zip) => {
            extractDatapack(zip)
                .then(resolve)
                .catch(reject);
        }).catch(reject);
    });
}

/**
 * @param {JSZip} zip 
 * @returns {Promise<string, object>}
 */
function extractDatapack(zip) {
    let mcmeta = false;
    let namespace = 'minecraft';
    const data = {
        biomes: [],
        carvers: [],
        dimensions: [],
        dimension_types: [],
        features: [],
        noises: [],
        surfaces: []
    };

    return new Promise((resolve, reject) => {
        const promises = [];
        zip.forEach(function(path, entry) {
            if (entry.dir) {
                return;
            }
            if (entry.name === 'pack.mcmeta') {
                mcmeta = true;
                return;
            }
            const regex = [
                DIMENSIONS_PATH, WORLDGEN_PATH,
                LEGACY_DIMENSIONS_PATH, LEGACY_WORLDGEN_PATH
            ].find(path => entry.name.match(path)) || WORLDGEN_PATH;
            promises.push(parseFile([LEGACY_DIMENSIONS_PATH, LEGACY_WORLDGEN_PATH].includes(regex), regex, entry.name, zip.file(entry.name).async('text')));
        });

        if (!mcmeta) {
            reject(new Error('Invalid datapack: no pack.mcmeta'));
        }

        Promise.all(promises).then(function(values) {
            values.forEach(function(value) {
                if (value === null) {
                    return;
                }

                if (value.namespace !== 'minecraft') {
                    namespace = value.namespace;
                }
                value.data.index = data[value.type].length;
                data[value.type].push(value.data);
            });
            resolve([namespace, data]);
        }).catch(e => reject(e));
    });
}

function getFolderType(folder) {
    switch (folder) {
        case 'configured_carver':
            return 'carvers';
        case 'configured_feature':
            return 'features';
        case 'configured_surface_builder':
            return 'surfaces';
        case 'noise_settings':
            return 'noises';
        default:
            return folder + 's';
    }
}

/**
 * Parse json file when it will be ready.
 * 
 * @param {boolean} legacy
 * @param {RegExp} pathRegex 
 * @param {string} filename 
 * @param {Promise<string>} contentPromise 
 * @returns {Promise<{namespace: string, data: object, type: string}>}
 */
async function parseFile(legacy, pathRegex, filename, contentPromise) {
    const d = pathRegex.exec(filename);
    if (d === null) {
        return new Promise((success) => success(null)); // Skip file
    }

    return new Promise((resolve, reject) => {
        contentPromise.then(content => {
            const obj = JSON.parse(content);
            const namespace = d[legacy ? 2 : 1];
            const type = getFolderType(d[legacy ? 1 : 2]);
            obj.key = namespace + ':' + d[3];
            const data = dataUpper(type, obj);
            resolve({ namespace, data, type });
        }).catch(e => {
            if (e.name !== 'SyntaxError') {
                console.error(e);
            }
            reject(new Error(`Cannot read ${filename}:\n${e.message}`));
        });
    });
}

function writeFile(zip, path, elements) {
    if (elements.length < 1) {
        return;
    }

    for (const el of elements) {
        const w = {...el};
        delete w.key;
        delete w.index;

        const [namespace, filename] = el.key.split(':');
        zip.folder(path.replace('%namespace%', namespace))
            .file(filename + '.json', JSON.stringify(w, null, 2));
    }
}
