import React, { useState, useEffect } from 'react';
import { jsonFetch } from '../utils/fetch';
import { VANILLA_FEATURES } from '../components/feature/FeatureDefaults';
import { useData } from '../hooks/context';

export const DataContext = React.createContext({
    vanilla: {
        biomes: [],
        blocks: [],
        entities: [],
        features: []
    },
    custom: {
        biomes: [],
        dimensions: [],
        features: [],
        updateBiomes: (biome) => {},
        updateDimensions: (dimension) => {},
        updateFeatures: (feature) => {}
    },
    namespace: ''
});

export function DataContextProvider({children, namespace}) {
    const [biomes, setBiomes] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [entities, setEntities] = useState([]);

    const [customBiomes, updateBiomes] = useData();
    const [dimensions, updateDimensions] = useData();
    const [features, updateFeatures] = useData();

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
        vanilla: { biomes, blocks, entities, features: VANILLA_FEATURES },
        custom: { biomes: customBiomes, dimensions, features, updateBiomes, updateDimensions, updateFeatures },
        namespace
    }}>{children}</DataContext.Provider>
}