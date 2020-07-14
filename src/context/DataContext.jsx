import React, { useState, useEffect } from 'react';
import { jsonFetch } from '../utils/fetch';

export const DataContext = React.createContext({
    vanilla: {
        biomes: [],
        entities: []
    },
    custom: {
        biomes: [],
        dimensions: [],
        updateBiomes: (biome) => {},
        updateDimensions: (dimension) => {}
    },
    namespace: ''
});

export function DataContextProvider({children, namespace}) {
    const [biomes, setBiomes] = useState([]);
    const [entities, setEntities] = useState([]);

    const [customBiomes, setCustomBiomes] = useState([]);
    const [dimensions, setCustomDimensions] = useState([]);

    const updateBiomes = function(biome) {
        setCustomBiomes(biomes => {
            const i = biomes.findIndex(({key}) => key === biome.key);
            if (i < 0) {
                biomes.push(biome);
            } else {
                biomes[i] = biome;
            }
            return biomes;
        });
    };

    const updateDimensions = function(dimension) {
        setCustomDimensions(dimensions => {
            const i = dimensions.findIndex(({key}) => key === dimension.key);
            if (i < 0) {
                dimensions.push(dimension);
            } else {
                dimensions[i] = dimension;
            }
            return dimensions;
        });
    };

    useEffect(() => {
        (async function () {
            jsonFetch('https://unpkg.com/minecraft-data@2.62.1/minecraft-data/data/pc/1.16.1/biomes.json')
                .then(biomes => setBiomes(biomes));
            jsonFetch('https://unpkg.com/minecraft-data@2.62.1/minecraft-data/data/pc/1.16.1/entities.json')
                .then(entities => setEntities(entities.map(entity => ({ value: 'minecraft:' + entity.name, label: entity.displayName }))));
        })();
    }, []);

    return <DataContext.Provider value={{
        vanilla: { biomes, entities },
        custom: { biomes: customBiomes, dimensions, updateBiomes, updateDimensions },
        namespace
    }}>{children}</DataContext.Provider>
}