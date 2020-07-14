import React, { useCallback, useState, useContext } from 'react';
import { Biome } from './biome/Biome';
import { Button } from './../ui/Button';
import { MenuItem } from './../ui/Menu';
import { Dimension } from './dimension/Dimension';
import { DataContext } from './../context/DataContext';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

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

    const onBiomeSave = useCallback(function(biome) {
        custom.updateBiomes(biome);
        setMenu({page: 'stats'});
    }, [custom]);

    const onDimensionSave = useCallback(function(dimension) {
        custom.updateDimensions(dimension);
        setMenu({page: 'stats'});
    }, [custom]);

    const editBiome = useCallback(function(index) {
        setMenu({page: 'biome', index});
    }, []);

    const editDimension = useCallback(function(index) {
        setMenu({page: 'dimension', index});
    }, []);

    return <div>
        <h2>Datapack {namespace}</h2>
        <div className="tabs"><nav className="tabs-menu">
            <MenuItem onClick={handleStatsClick} active={menu.page === 'stats'}>Stats</MenuItem>
            <MenuItem onClick={handleAddBiomeClick} active={menu.page === 'biome'}>Biome</MenuItem>
            <MenuItem onClick={handleAddDimensionClick} active={menu.page === 'dimension'}>Dimension</MenuItem>
        </nav></div>
        {menu.page === 'biome' && <Biome onSave={onBiomeSave} data={custom.biomes[menu.index]} />}
        {menu.page === 'dimension' && <Dimension onSave={onDimensionSave} data={custom.dimensions[menu.index]} />}
        {menu.page === 'stats' && <Stats biomes={custom.biomes} dimensions={custom.dimensions} namespace={namespace} editBiome={editBiome} editDimension={editDimension} />}
    </div>
}

function Stats({biomes, dimensions, namespace, editBiome, editDimension}) {

    const handleBiomeClick = function(e, index) {
        e.preventDefault();
        editBiome(index);
    }

    const handleDimensionClick = function(e, index) {
        e.preventDefault();
        editDimension(index);
    }

    const handleGenerateClick = function(e) {
        e.preventDefault();
        const zip = new JSZip();
        zip.file('pack.mcmeta', JSON.stringify({ pack: { pack_format: 5, description: 'Custom dimension' } }, null, 4));
        const dims = zip.folder('data/minecraft/dimension/' + namespace);
        for (const dimension of dimensions) {
            const w = {...dimension};
            delete w.key;
            dims.file(dimension.key + '.json', JSON.stringify(w, null, 2));
        }
        const b = zip.folder('data/minecraft/worldgen/biome/' + namespace);
        for (const biome of biomes) {
            const w = {...biome};
            delete w.key;
            b.file(biome.key + '.json', JSON.stringify(w, null, 2));
        }
        zip.generateAsync({ type: 'blob' })
            .then(function(content) {
                saveAs(content, 'generated_datapack.zip');
            });
    }

    return <div className="mtm">
        <h5><strong>{biomes.length}</strong> custom biomes</h5>
        <ul>{biomes.map((biome, i) => <li key={i}><a href="#edit-biome" onClick={(e) => handleBiomeClick(e, i)}>{biome.key}</a></li>)}</ul>
        
        <h5><strong>{dimensions.length}</strong> custom dimensions</h5>
        <ul>{dimensions.map((dim, i) => <li key={i}><a href="#edit-dimension" onClick={(e) => handleDimensionClick(e, i)}>{dim.key}</a></li>)}</ul>
        
        {dimensions.length > 0 &&
            <p><Button onClick={handleGenerateClick}>Generate</Button></p>
        }
    </div>
}