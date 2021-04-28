import { PATHS } from "../context/Paths";
import { dataUpper } from "./data";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const DIMENSIONS_PATH = /^data\/([a-z0-9_.-]+)\/(dimension|dimension_type)\/([a-z0-9/._-]+).json$/;
const WORLDGEN_PATH = /^data\/([a-z0-9_.-]+)\/worldgen\/(biome|configured_carver|configured_feature|configured_surface_builder|noise_settings|processor_list)\/([a-z0-9/._-]+).json$/;

const LEGACY_DIMENSIONS_PATH = /^data\/minecraft\/(dimension|dimension_type)\/([a-z0-9_.-]+)\/([a-z0-9/._-]+).json$/;
const LEGACY_WORLDGEN_PATH = /^data\/minecraft\/worldgen\/(biome|configured_carver|configured_feature|configured_surface_builder|noise_settings|processor_list)\/([a-z0-9_.-]+)\/([a-z0-9/._-]+).json$/;

/**
 * Build zip in blob.
 * 
 * @param {object} custom 
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
    Object.entries(PATHS).forEach(([type, path]) => writeFile(zip, path, custom[type]));
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
async function extractDatapack(zip) {
    let namespace = 'minecraft';
    const data = {
        biomes: [],
        carvers: [],
        dimensions: [],
        dimension_types: [],
        features: [],
        noises: [],
        processors: [],
        surfaces: []
    };

    const pack = zip.file('pack.mcmeta');
    if (pack === null) {
        throw new Error('Invalid datapack: no pack.mcmeta');
    }
    let legacy = false;
    try {
        const mcmeta = JSON.parse(await pack.async('text'));
        legacy = mcmeta.pack.pack_format < 6;
    } catch (e) {
        throw new Error(`Error reading pack.mcmeta file: ${e.message}`);
    }
    

    return new Promise((resolve, reject) => {
        const promises = [];
        zip.forEach(function(path, entry) {
            if (entry.dir) {
                return;
            }
            const paths = legacy ? [LEGACY_DIMENSIONS_PATH, LEGACY_WORLDGEN_PATH] : [DIMENSIONS_PATH, WORLDGEN_PATH];
            const regex = paths.find(path => entry.name.match(path)) || WORLDGEN_PATH;
            promises.push(parseFile(legacy, regex, entry.name, zip.file(entry.name).async('text')));
        });

        Promise.all(promises).then(function(values) {
            values.forEach(function(value) {
                if (value === null) {
                    return;
                }

                if (value.namespace !== 'minecraft') {
                    namespace = value.namespace;
                }
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
        case 'processor_list':
            return 'processors';
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
