import React, { useCallback, useState, useContext } from 'react';
import { Biome } from './biome/Biome';
import { Button } from './../ui/Button';
import { MenuItem } from './../ui/Menu';
import { Dimension } from './dimension/Dimension';
import { DataContext } from './../context/DataContext';
import { ConfiguredFeature } from './feature/ConfiguredFeature';
import { buildZip } from '../utils/zip';

export function Datapack() {
    const context = useContext(DataContext);
    const custom = context.custom;
    const namespace = context.namespace;
    const [menu, setMenu] = useState({page: 'stats'});

    const handleStatsClick = useCallback(function(e) {
        e.preventDefault();
        setMenu({page: 'stats'});
    }, []);
    const handleAddBiomeClick = useCallback(function(e) {
        e.preventDefault();
        setMenu({page: 'biome'});
    }, []);
    const handleAddDimensionClick = useCallback(function(e) {
        e.preventDefault();
        setMenu({page: 'dimension'});
    }, []);
    const handleAddFeatureClick = useCallback(function(e) {
        e.preventDefault();
        setMenu({page: 'feature'});
    }, []);

    const onBiomeSave = useCallback(function(biome) {
        custom.updateBiomes(biome);
        setMenu({page: 'stats'});
    }, [custom]);
    const onDimensionSave = useCallback(function(dimension) {
        custom.updateDimensions(dimension);
        setMenu({page: 'stats'});
    }, [custom]);
    const onFeatureSave = useCallback(function(feature) {
        custom.updateFeatures(feature);
        setMenu({page: 'stats'});
    }, [custom]);

    const editBiome = useCallback(function(index) {
        setMenu({page: 'biome', index});
    }, []);
    const editDimension = useCallback(function(index) {
        setMenu({page: 'dimension', index});
    }, []);
    const editFeature = useCallback(function(index) {
        setMenu({page: 'feature', index});
    }, []);

    return <div>
        <h2>Datapack {namespace}</h2>
        <div className="tabs"><nav className="tabs-menu">
            <MenuItem onClick={handleStatsClick} active={menu.page === 'stats'}>Stats</MenuItem>
            <MenuItem onClick={handleAddBiomeClick} active={menu.page === 'biome'}>Biome</MenuItem>
            <MenuItem onClick={handleAddFeatureClick} active={menu.page === 'feature'}>Feature</MenuItem>
            <MenuItem onClick={handleAddDimensionClick} active={menu.page === 'dimension'}>Dimension</MenuItem>
        </nav></div>
        {menu.page === 'biome' && <Biome onSave={onBiomeSave} data={custom.biomes[menu.index]} />}
        {menu.page === 'feature' && <ConfiguredFeature onSave={onFeatureSave} data={custom.features[menu.index]} />}
        {menu.page === 'dimension' && <Dimension onSave={onDimensionSave} data={custom.dimensions[menu.index]} />}
        {menu.page === 'stats' && <Stats biomes={custom.biomes} dimensions={custom.dimensions} features={custom.features} namespace={namespace} editBiome={editBiome} editDimension={editDimension} editFeature={editFeature} />}
    </div>
}

function Stats({biomes, dimensions, features, namespace, editBiome, editDimension, editFeature}) {

    const handleBiomeClick = function(e, index) {
        e.preventDefault();
        editBiome(index);
    }
    const handleDimensionClick = function(e, index) {
        e.preventDefault();
        editDimension(index);
    }
    const handleFeatureClick = function(e, index) {
        e.preventDefault();
        editFeature(index);
    }

    const handleGenerateClick = function(e) {
        e.preventDefault();
        buildZip(namespace, biomes, dimensions, features);
    }

    return <div className="mtm">
        <h5><strong>{biomes.length}</strong> custom biomes</h5>
        <ul>{biomes.map((biome, i) => <li key={i}><a href="#edit-biome" onClick={(e) => handleBiomeClick(e, i)}>{biome.key}</a></li>)}</ul>
        
        <h5><strong>{dimensions.length}</strong> custom dimensions</h5>
        <ul>{dimensions.map((dim, i) => <li key={i}><a href="#edit-dimension" onClick={(e) => handleDimensionClick(e, i)}>{dim.key}</a></li>)}</ul>
        
        <h5><strong>{features.length}</strong> configured features</h5>
        <ul>{features.map((feature, i) => <li key={i}><a href="#edit-feature" onClick={(e) => handleFeatureClick(e, i)}>{feature.key}</a></li>)}</ul>

        {dimensions.length > 0 &&
            <p><Button onClick={handleGenerateClick}>Generate</Button></p>
        }
    </div>
}