import JSZip from "jszip";
import { saveAs } from "file-saver";
import { dataUpper } from "./data";

const DIMENSIONS_PATH = /^data\/minecraft\/(dimension)\/([a-z0-9._-]+)\/([a-z0-9._-]+).json$/;
const WORLDGEN_PATH = /^data\/minecraft\/worldgen\/(biome|configured_feature|configured_surface_builder)\/([a-z0-9._-]+)\/([a-z0-9._-]+).json$/;

/**
 * Build zip in blob.
 * 
 * @param {string} namespace 
 * @param {{ biomes: object[], dimensions: object[], features: object[], surfaces: object[] }} custom 
 */
export function buildZip(namespace, custom) {
    const zip = new JSZip();
    zip.file('pack.mcmeta', JSON.stringify({ pack: { pack_format: 5, description: 'Custom dimension' } }, null, 4));
    writeFile(zip, `data/minecraft/dimension/${namespace}`, custom.dimensions);
    writeFile(zip, `data/minecraft/worldgen/biome/${namespace}`, custom.biomes);
    writeFile(zip, `data/minecraft/worldgen/configured_feature/${namespace}`, custom.features);
    writeFile(zip, `data/minecraft/worldgen/configured_surface_builder/${namespace}`, custom.surfaces);
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
        if (file.type !== 'application/zip') {
            reject(new Error('File is not a .zip'));
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
    let namespace = 'test';
    const data = {
        biomes: [],
        dimensions: [],
        features: [],
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
            const regex = path.includes('data/minecraft/dimension/') ? DIMENSIONS_PATH : WORLDGEN_PATH;
            promises.push(parseFile(regex, entry.name, zip.file(entry.name).async('text')));
        });

        if (!mcmeta) {
            reject(new Error('Invalid datapack: no pack.mcmeta'));
        }

        Promise.all(promises).then(function(values) {
            values.forEach(function(value) {
                if (value === null) {
                    return;
                }

                namespace = value.namespace;
                data[value.type].push(value.data);
            });
            resolve([namespace, data]);
        }).catch(e => reject(e));
    });
}

function getFolderType(folder) {
    switch (folder) {
        case 'configured_feature':
            return 'features';
        case 'configured_surface_builder':
            return 'surfaces';
        default:
            return folder + 's';
    }
}

/**
 * Parse json file when it will be ready.
 * 
 * @param {RegExp} pathRegex 
 * @param {string} filename 
 * @param {Promise<string>} contentPromise 
 * @returns {Promise<{namespace: string, data: object, type: string}>}
 */
async function parseFile(pathRegex, filename, contentPromise) {
    const d = pathRegex.exec(filename);
    if (d === null) {
        return new Promise((success) => success(null)); // Skip file
    }

    return new Promise((resolve, reject) => {
        contentPromise.then(content => {
            const obj = JSON.parse(content);
            obj.key = d[3];
            const data = dataUpper(getFolderType(d[1]), obj);
            resolve({
                namespace: d[2],
                data,
                type: getFolderType(d[1])
            });
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
    const folder = zip.folder(path);
    for (const el of elements) {
        const w = {...el};
        delete w.key;
        folder.file(el.key + '.json', JSON.stringify(w, null, 2));
    }
}