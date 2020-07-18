import JSZip from "jszip";
import { saveAs } from "file-saver";

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

function writeFile(zip, path, elements) {
    if (elements.length < 0) {
        return;
    }
    const folder = zip.folder(path);
    for (const el of elements) {
        const w = {...el};
        delete w.key;
        console.log(w);
        folder.file(el.key + '.json', JSON.stringify(w, null, 2));
    }
}