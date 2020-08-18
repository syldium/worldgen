import React, { useCallback, useState, useEffect } from 'react';
import { jsonFetch } from '../utils/fetch';
import { VANILLA_FEATURES } from '../components/feature/VanillaFeatures';
import { useData } from '../hooks/context';
import { VANILLA_SURFACE_BUILDERS } from '../components/surface/SurfaceBuilderDefaults';
import { VANILLA_NOISES } from '../components/noise/NoiseDefaults';
import { VANILLA_DIMENSION_TYPES } from '../components/dimension/DimensionDefaults';
import { VANILLA_CARVERS } from '../components/carver/CarverDefaults';
import JSZip from 'jszip';
import { getAbsolutePath } from './Paths';

export const DataContext = React.createContext({
    vanilla: {
        biomes: [],
        blocks: [],
        carvers: [],
        dimensions: [],
        dimension_types: [],
        entities: [],
        features: [],
        noises: [],
        sounds: [],
        surfaces: [],
        /**
         * @param {string} type 
         * @param {string} key 
         * @returns {Promise<object>}  
         */
        getVanillaResource: (type, key) => {}
    },
    custom: {
        biomes: [],
        carvers: [],
        dimensions: [],
        dimension_types: [],
        features: [],
        noises: [],
        processors: [],
        surfaces: [],
        updateBiomes: (biome) => {},
        updateCarvers: (carver) => {},
        updateDimensions: (dimension) => {},
        updateDimensionTypes: (dimension_type) => {},
        updateFeatures: (feature) => {},
        updateNoises: (noise) => {},
        updateProcessors: (processor) => {},
        updateSurfacesBuilders: (surface_builder) => {}
    },
    namespace: ''
});

export function DataContextProvider({children, namespace, initial = {}}) {
    const [biomes, setBiomes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [entities, setEntities] = useState([]);
    const [sounds, setSounds] = useState([]);

    const [customBiomes, updateBiomes] = useData(initial.biomes);
    const [carvers, updateCarvers] = useData(initial.carvers);
    const [dimensions, updateDimensions] = useData(initial.dimensions);
    const [dimension_types, updateDimensionTypes] = useData(initial.dimension_types);
    const [features, updateFeatures] = useData(initial.features);
    const [noises, updateNoises] = useData(initial.noises);
    const [processors, updateProcessors] = useData(initial.processors);
    const [surfaces, updateSurfacesBuilders] = useData(initial.surfaces);

    const [vanillaZip, setVanillaZip] = useState(null);

    useEffect(() => {
        (async function () {
            jsonFetch('https://unpkg.com/minecraft-data@2.65.0/minecraft-data/data/pc/1.16.1/biomes.json')
                .then(biomes => setBiomes(biomes));
            jsonFetch('https://unpkg.com/minecraft-data@2.65.0/minecraft-data/data/pc/1.16.1/blocks.json')
                .then(blocks => setBlocks(blocks));
            jsonFetch('https://unpkg.com/minecraft-data@2.65.0/minecraft-data/data/pc/1.16.1/entities.json')
                .then(entities => setEntities(entities.map(entity => ({ value: 'minecraft:' + entity.name, label: entity.displayName }))));
            jsonFetch('https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/registries/sound_event/data.min.json', {}, {})
                .then(sounds => setSounds(sounds.values.map(sound => ({ value: sound, label: sound.substr(10) }))));
        })();
    }, []);

    const getVanillaResource = useCallback(async function (type, key) {
        let zip = vanillaZip;
        if (zip === null) {
            const blob = (await fetch('https://raw.githubusercontent.com/slicedlime/examples/master/vanilla_worldgen.zip')).blob();
            try {
                zip = await JSZip.loadAsync(blob);
            } catch (e) {
                setVanillaZip(e);
                return Promise.reject(new Error(`Unable to download the vanilla resource archive for reference.\n${e.message}`));
            }
            setVanillaZip(zip);
        } else if (zip instanceof Error) {
            return Promise.reject(zip);
        }
        const relative = getAbsolutePath(type, 'minecraft', key).substr(15).replace('minecraft:', '');
        const file = zip.file(relative);
        if (file === null) {
            return Promise.reject(new Error('Unable to find the associated vanilla file.'));
        }
        return Promise.resolve(JSON.parse(await file.async('text')));
    }, [vanillaZip]);

    return <DataContext.Provider value={{
        vanilla: {
            biomes,
            blocks,
            carvers: VANILLA_CARVERS,
            dimensions: VANILLA_DIMENSION_TYPES.filter(o => !o.value.includes('cave')),
            dimension_types: VANILLA_DIMENSION_TYPES,
            entities,
            features: VANILLA_FEATURES,
            noises: VANILLA_NOISES,
            sounds,
            surfaces: VANILLA_SURFACE_BUILDERS,
            getVanillaResource
        },
        custom: {
            biomes: customBiomes, carvers, dimensions, dimension_types, features, noises, processors, surfaces,
            updateBiomes, updateCarvers, updateDimensions, updateDimensionTypes, updateFeatures, updateNoises, updateProcessors, updateSurfacesBuilders
        },
        namespace
    }}>{children}</DataContext.Provider>
}