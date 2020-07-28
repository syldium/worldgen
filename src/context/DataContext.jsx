import React, { useState, useEffect } from 'react';
import { jsonFetch } from '../utils/fetch';
import { VANILLA_FEATURES } from '../components/feature/FeatureDefaults';
import { useData } from '../hooks/context';
import { VANILLA_SURFACE_BUILDERS } from '../components/surface/SurfaceBuilderDefaults';

export const DataContext = React.createContext({
    vanilla: {
        biomes: [],
        blocks: [],
        entities: [],
        features: [],
        surfaces: []
    },
    custom: {
        biomes: [],
        dimensions: [],
        features: [],
        surfaces: [],
        updateBiomes: (biome) => {},
        updateDimensions: (dimension) => {},
        updateFeatures: (feature) => {},
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
    const [features, updateFeatures] = useData(initial.features);
    const [surfaces, updateSurfacesBuilders] = useData(initial.surfaces);

    useEffect(() => {
        (async function () {
            jsonFetch('https://unpkg.com/minecraft-data@2.62.1/minecraft-data/data/pc/1.16.1/biomes.json')
                .then(biomes => setBiomes(biomes));
            jsonFetch('https://unpkg.com/minecraft-data@2.62.1/minecraft-data/data/pc/1.16.1/blocks.json')
                .then(blocks => setBlocks(blocks));
            jsonFetch('https://unpkg.com/minecraft-data@2.62.1/minecraft-data/data/pc/1.16.1/entities.json')
                .then(entities => setEntities(entities.map(entity => ({ value: 'minecraft:' + entity.name, label: entity.displayName }))));
        })();
    }, []);

    return <DataContext.Provider value={{
        vanilla: { biomes, blocks, entities, features: VANILLA_FEATURES, surfaces: VANILLA_SURFACE_BUILDERS },
        custom: { biomes: customBiomes, dimensions, features, surfaces, updateBiomes, updateDimensions, updateFeatures, updateSurfacesBuilders },
        namespace
    }}>{children}</DataContext.Provider>
}