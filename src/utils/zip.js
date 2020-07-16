import JSZip from "jszip";
import { saveAs } from "file-saver";

export function buildZip(namespace, biomes, dimensions, features) {
    const zip = new JSZip();
    zip.file('pack.mcmeta', JSON.stringify({ pack: { pack_format: 5, description: 'Custom dimension' } }, null, 4));
    writeFile(zip, `data/minecraft/dimension/${namespace}`, dimensions);
    writeFile(zip, `data/minecraft/worldgen/biome/${namespace}`, biomes);
    writeFile(zip, `data/minecraft/worldgen/configured_feature/${namespace}`, features);
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