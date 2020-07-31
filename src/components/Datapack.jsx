import React, { useCallback, useState, useContext } from 'react';
import { Biome } from './biome/Biome';
import { Button } from './../ui/Button';
import { MenuItem } from './../ui/Menu';
import { Dimension } from './dimension/Dimension';
import { DataContext } from './../context/DataContext';
import { RawConfiguredFeature } from './feature/ConfiguredFeature';
import { buildZip } from '../utils/zip';
import { SurfaceBuilder } from './surface/SurfaceBuilder';
import { NoiseSettings } from './noise/NoiseSettings';
import { displayNamespacedKey } from '../utils/data';

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
    const handleAddNoiseClick = useCallback(function(e) {
        e.preventDefault();
        setMenu({page: 'noise'});
    }, []);
    const handleAddSurfaceBuilderClick = useCallback(function(e) {
        e.preventDefault();
        setMenu({page: 'surface'});
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
    const onNoiseSave = useCallback(function(noise) {
        custom.updateNoises(noise);
        setMenu({page: 'stats'});
    }, [custom]);
    const onSurfaceBuilderSave = useCallback(function(surface_builder) {
        custom.updateSurfacesBuilders(surface_builder);
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
    const editNoise = useCallback(function(index) {
        setMenu({page: 'noise', index});
    }, []);
    const editSurface = useCallback(function(index) {
        setMenu({page: 'surface', index});
    }, []);

    return <div>
        <h2>Datapack {namespace}</h2>
        <div className="tabs"><nav className="tabs-menu">
            <MenuItem onClick={handleStatsClick} active={menu.page === 'stats'}>Stats</MenuItem>
            <MenuItem onClick={handleAddBiomeClick} active={menu.page === 'biome'}>Biome</MenuItem>
            <MenuItem onClick={handleAddSurfaceBuilderClick} active={menu.page === 'surface'}>Surfaces builder</MenuItem>
            <MenuItem onClick={handleAddFeatureClick} active={menu.page === 'feature'}>Feature</MenuItem>
            <MenuItem onClick={handleAddDimensionClick} active={menu.page === 'dimension'}>Dimension</MenuItem>
            <MenuItem onClick={handleAddNoiseClick} active={menu.page === 'noise'}>Noise</MenuItem>
        </nav></div>
        {menu.page === 'biome' && <Biome onSave={onBiomeSave} data={custom.biomes[menu.index]} />}
        {menu.page === 'surface' && <SurfaceBuilder onSave={onSurfaceBuilderSave} data={custom.surfaces[menu.index]} />}
        {menu.page === 'feature' && <RawConfiguredFeature onSave={onFeatureSave} data={custom.features[menu.index]} />}
        {menu.page === 'noise' && <NoiseSettings onSave={onNoiseSave} data={custom.noises[menu.index]} />}
        {menu.page === 'dimension' && <Dimension onSave={onDimensionSave} data={custom.dimensions[menu.index]} />}
        {menu.page === 'stats' && <Stats custom={custom} namespace={namespace} editBiome={editBiome} editDimension={editDimension} editFeature={editFeature} editNoise={editNoise} editSurface={editSurface} />}
    </div>
}

function Stats({custom, namespace, editBiome, editDimension, editFeature, editNoise, editSurface}) {

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
    const handleNoiseClick = function(e, index) {
        e.preventDefault();
        editNoise(index);
    }
    const handleSurfaceClick = function(e, index) {
        e.preventDefault();
        editSurface(index);
    }

    const handleGenerateClick = function(e) {
        e.preventDefault();
        buildZip(custom);
    }

    const mayGenerate = Object.values(custom).some(content => {
        if (Array.isArray(content)) {
            return content.length;
        }
        return false;
    });

    return <div className="mtm">
        <StatsTitle data={custom.biomes} namespace={namespace} onClick={handleBiomeClick}>custom biome</StatsTitle>
        <StatsTitle data={custom.dimensions} namespace={namespace} onClick={handleDimensionClick}>custom dimension</StatsTitle>
        <StatsTitle data={custom.features} namespace={namespace} onClick={handleFeatureClick}>configured feature</StatsTitle>
        <StatsTitle data={custom.surfaces} namespace={namespace} onClick={handleSurfaceClick}>configured surface builder</StatsTitle>
        <StatsTitle data={custom.noises} namespace={namespace} onClick={handleNoiseClick}>custom noise</StatsTitle>
        {mayGenerate && <p><Button onClick={handleGenerateClick}>Generate</Button></p>}
    </div>
}

function StatsTitle({ children, data, namespace, onClick }) {
    return <>
        <h5><strong>{data.length}</strong> {children}{data.length > 1 && 's'}</h5>
        <ul>
            {data.map((d, i) => {
                const name = displayNamespacedKey(d.key, namespace);
                return <li key={i}><a href="#edit" onClick={(e) => onClick(e, i)}>{name}</a></li>
            })}
        </ul>
    </>
}