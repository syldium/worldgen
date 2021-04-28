import React, { useCallback, useEffect, useState } from 'react';

import { VANILLA_CARVERS } from '../components/carver/CarverDefaults';
import { VANILLA_DIMENSION_TYPES } from '../components/dimension/DimensionDefaults';
import { VANILLA_FEATURES } from '../components/feature/VanillaFeatures';
import { VANILLA_NOISES } from '../components/noise/NoiseDefaults';
import { VANILLA_PROCESSORS } from '../components/processor/ProcessorDefaults';
import { VANILLA_SURFACE_BUILDERS } from '../components/surface/SurfaceBuilderDefaults';
import { getAbsolutePath } from './Paths';
import { jsonFetch } from '../utils/fetch';
import {useCrudState} from "../hooks/form";
import { useData } from '../hooks/context';
import JSZip from 'jszip';

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
        processors: [],
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
        blocks: [],
        carvers: [],
        dimensions: [],
        dimension_types: [],
        features: [],
        noises: [],
        processors: [],
        structures: [],
        surfaces: [],
        template_pools: [],
        updateBiomes: (biome) => {},
        addBlock: (block) => {},
        updateCarvers: (carver) => {},
        updateDimensions: (dimension) => {},
        updateDimensionTypes: (dimension_type) => {},
        updateFeatures: (feature) => {},
        updateNoises: (noise) => {},
        updateProcessors: (processor) => {},
        updateStructures: (structure) => {},
        updateSurfacesBuilders: (surface_builder) => {},
        updateTemplatePools: (template_pool) => {},
        resetAll: (initial = {}) => {}
    },
    namespace: ''
});

export function DataContextProvider({children, namespace, initial = {}}) {
    const [biomes, setBiomes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [entities, setEntities] = useState([]);
    const [sounds, setSounds] = useState([]);

    const [customBiomes, updateBiomes, resetBiomes] = useData(initial.biomes);
    const [customBlocks, dispatchBlock] = useCrudState();
    const [carvers, updateCarvers, resetCarvers] = useData(initial.carvers);
    const [dimensions, updateDimensions, resetDimensions] = useData(initial.dimensions);
    const [dimension_types, updateDimensionTypes, resetDimensionTypes] = useData(initial.dimension_types);
    const [features, updateFeatures, resetFeatures] = useData(initial.features);
    const [noises, updateNoises, resetNoises] = useData(initial.noises);
    const [processors, updateProcessors, resetProcessors] = useData(initial.processors);
    const [structures, updateStructures, resetStructures] = useData(initial.structures);
    const [surfaces, updateSurfacesBuilders, resetSurfacesBuilders] = useData(initial.surfaces);
    const [template_pools, updateTemplatePools, resetTemplatePools] = useData(initial.template_pools);

    const [vanillaZip, setVanillaZip] = useState(null);

    useEffect(() => {
        (async function () {
            jsonFetch('https://unpkg.com/minecraft-data@2.84.0/minecraft-data/data/pc/1.16.2/biomes.json')
                .then(biomes => setBiomes(biomes));
            jsonFetch('https://unpkg.com/minecraft-data@2.84.0/minecraft-data/data/pc/1.16.2/blocks.json')
                .then(blocks => setBlocks(blocks));
            jsonFetch('https://unpkg.com/minecraft-data@2.84.0/minecraft-data/data/pc/1.16.2/entities.json')
                .then(entities => setEntities(entities.map(entity => ({ value: 'minecraft:' + entity.name, label: entity.displayName }))));
            jsonFetch('https://raw.githubusercontent.com/Arcensoth/mcdata/master/processed/reports/registries/sound_event/data.min.json', {}, {})
                .then(sounds => setSounds(sounds.values.map(sound => ({ value: sound, label: sound.substr(10) }))));
        })();
    }, []);

    const getVanillaResource = useCallback(async function (type, key) {
        let zip = vanillaZip;
        if (zip === null) {
            const blob = (await fetch('https://raw.githubusercontent.com/slicedlime/examples/80fb4b8418ff3ff5724f4a0438bb422f58960bd9/vanilla_worldgen.zip')).blob();
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
        const absolute = getAbsolutePath(type, 'minecraft', key).substr(15).replace('minecraft:', '');
        const file = zip.file(absolute);
        if (file === null) {
            return Promise.reject(new Error(`Unable to find the associated vanilla file (tested ${absolute}).`));
        }
        return Promise.resolve(JSON.parse(await file.async('text')));
    }, [vanillaZip]);

    const addBlock = useCallback(function (block) {
        dispatchBlock({ type: 'ADD', payload: { displayName: "(Custom) " + block, name: block } });
    }, [dispatchBlock]);

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
            processors: VANILLA_PROCESSORS,
            sounds,
            surfaces: VANILLA_SURFACE_BUILDERS,
            getVanillaResource
        },
        custom: {
            biomes: customBiomes, blocks: customBlocks, carvers, dimensions, dimension_types, features, noises, processors, structures, surfaces, template_pools,
            updateBiomes, addBlock, updateCarvers, updateDimensions, updateDimensionTypes, updateFeatures, updateNoises, updateProcessors, updateStructures, updateSurfacesBuilders, updateTemplatePools,
            resetAll: function (initial = {}) {
                resetBiomes(initial.biomes);
                resetCarvers(initial.carvers);
                resetDimensions(initial.dimensions);
                resetDimensionTypes(initial.dimension_types);
                resetFeatures(initial.features);
                resetNoises(initial.noises);
                resetProcessors(initial.processors);
                resetStructures(initial.structures);
                resetSurfacesBuilders(initial.surfaces);
                resetTemplatePools(initial.template_pools);
            }
        },
        namespace
    }}>{children}</DataContext.Provider>
}