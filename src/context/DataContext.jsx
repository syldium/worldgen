import React, { useState, useEffect } from 'react';
import { jsonFetch } from '../utils/fetch';
import { VANILLA_FEATURES } from '../components/feature/FeatureDefaults';
import { useData } from '../hooks/context';
import { VANILLA_SURFACE_BUILDERS } from '../components/surface/SurfaceBuilderDefaults';
import { VANILLA_NOISES } from '../components/noise/NoiseDefaults';
import { VANILLA_DIMENSION_TYPES } from '../components/dimension/DimensionDefaults';

export const DataContext = React.createContext({
    vanilla: {
        biomes: [],
        blocks: [],
        dimension_types: [],
        entities: [],
        features: [],
        noises: [],
        surfaces: []
    },
    custom: {
        biomes: [],
        dimensions: [],
        dimension_types: [],
        features: [],
        noises: [],
        surfaces: [],
        updateBiomes: (biome) => {},
        updateDimensions: (dimension) => {},
        updateDimensionTypes: (dimension_type) => {},
        updateFeatures: (feature) => {},
        updateNoises: (noise) => {},
        updateSurfacesBuilders: (surface_builder) => {}
    },
    namespace: ''
});

export function DataContextProvider({children, namespace, initial = {}}) {
    const [biomes, setBiomes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [entities, setEntities] = useState([]);

    const [customBiomes, updateBiomes] = useData(initial.biomes);
    const [dimensions, updateDimensions] = useData(initial.dimensions);
    const [dimension_types, updateDimensionTypes] = useData(initial.dimension_types);
    const [features, updateFeatures] = useData(initial.features);
    const [noises, updateNoises] = useData(initial.noises);
    const [surfaces, updateSurfacesBuilders] = useData(initial.surfaces);

    useEffect(() => {
        (async function () {
            jsonFetch('https://unpkg.com/minecraft-data@2.63.0/minecraft-data/data/pc/1.16.1/biomes.json')
                .then(biomes => setBiomes(biomes));
            jsonFetch('https://unpkg.com/minecraft-data@2.63.0/minecraft-data/data/pc/1.16.1/blocks.json')
                .then(blocks => setBlocks(blocks));
            jsonFetch('https://unpkg.com/minecraft-data@2.63.0/minecraft-data/data/pc/1.16.1/entities.json')
                .then(entities => setEntities(entities.map(entity => ({ value: 'minecraft:' + entity.name, label: entity.displayName }))));
        })();
    }, []);

    return <DataContext.Provider value={{
        vanilla: { biomes, blocks, dimension_types: VANILLA_DIMENSION_TYPES, entities, features: VANILLA_FEATURES, noises: VANILLA_NOISES, surfaces: VANILLA_SURFACE_BUILDERS },
        custom: { biomes: customBiomes, dimensions, dimension_types, features, noises, surfaces,
            updateBiomes, updateDimensions, updateDimensionTypes, updateFeatures, updateNoises, updateSurfacesBuilders },
        namespace
    }}>{children}</DataContext.Provider>
}