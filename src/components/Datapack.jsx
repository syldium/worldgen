import { MenuItem, NavBar } from './../ui/Menu';
import React, { useContext, useEffect } from 'react';

import { Biome } from './biome/Biome';
import { Button } from './../ui/Button';
import { ConfiguredCarverForm } from './carver/ConfiguredCarver';
import { DataContext } from './../context/DataContext';
import { Dimension } from './dimension/Dimension';
import { DimensionTypeForm } from './dimension/DimensionType';
import Masonry from 'masonry-layout';
import { NoiseSettings } from './noise/NoiseSettings';
import { ProcessorList } from './processor/ProcessorList';
import { RawConfiguredFeature } from './feature/ConfiguredFeature';
import { SurfaceBuilder } from './surface/SurfaceBuilder';
import { buildZip } from '../utils/zip';
import { capitalize } from '../utils/data';
import { displayNamespacedKey } from '../utils/data';
import { useMenu } from '../hooks/ui';

export function Datapack() {
    const context = useContext(DataContext);
    const custom = context.custom;
    const namespace = context.namespace;
    const [page, index, setMenu] = useMenu();

    const handleSave = function (type, data) {
        const method = 'update' + function () {
            switch (type) {
                case 'surface':
                    return 'SurfacesBuilders';
                case 'dimension_type':
                    return 'DimensionTypes';
                default:
                    return capitalize(type) + 's';
            }
        }();
        custom[method](data, custom[type + 's'][index]);
        setMenu(null);
    }
    const handleGenerateClick = function(e) {
        e.preventDefault();
        buildZip(custom);
    }
    window.scrollTo(0, 0);

    const mayGenerate = Object.values(custom).some(content => {
        if (Array.isArray(content)) {
            return content.length;
        }
        return false;
    });

    return <div>
        <NavBar>
            <nav className="tabs"><ul>
                <MenuItem onClick={e => setMenu(e, 'main')} active={page === 'main'}>Main</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'biome')} active={page === 'biome'}>Biome</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'surface')} active={page === 'surface'}>Surface builder</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'feature')} active={page === 'feature'}>Feature</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'dimension')} active={page === 'dimension'}>Dimension</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'noise')} active={page === 'noise'}>Noise</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'processor')} active={page === 'processor'}>Processor</MenuItem>
            </ul></nav>
        </NavBar>
        <div className="content">
            {page === 'biome' && <Biome onSave={biome => handleSave('biome', biome)} data={custom.biomes[index]} />}
            {page === 'carver' && <ConfiguredCarverForm onSave={carver => handleSave('carver', carver)} data={custom.carvers[index]} />}
            {page === 'surface' && <SurfaceBuilder onSave={surface => handleSave('surface', surface)} data={custom.surfaces[index]} />}
            {page === 'feature' && <RawConfiguredFeature onSave={feature => handleSave('feature', feature)} data={custom.features[index]} />}
            {page === 'noise' && <NoiseSettings onSave={noise => handleSave('noise', noise)} data={custom.noises[index]} />}
            {page === 'processor' && <ProcessorList onSave={processor => handleSave('processor', processor)} data={custom.processors[index]} />}
            {page === 'dimension' && <Dimension onSave={dimension => handleSave('dimension', dimension)} data={custom.dimensions[index]} />}
            {page === 'dimension_type' && <DimensionTypeForm onSave={dimension => handleSave('dimension_type', dimension)} data={custom.dimension_types[index]} />}
            {page === 'main' && <>
                <h2>Datapack {namespace} <Button type="submit" onClick={handleGenerateClick} disabled={!mayGenerate}>Generate</Button></h2>
                <Main custom={custom} namespace={namespace} onSave={handleSave} setPage={setMenu} />
            </>}
        </div>
    </div>
}

function Main({namespace, onSave, setPage}) {

    useEffect(() => {
        new Masonry( '.stats', {
        itemSelector: '.card',
        gutter: 15
      });
    }, []);

    return <div className="stats">
        <StatsTitle type="feature" namespace={namespace} onClick={setPage} onDelete={onSave}>configured feature</StatsTitle>
        <StatsTitle type="biome" namespace={namespace} onClick={setPage} onDelete={onSave}>custom biome</StatsTitle>
        <StatsTitle type="surface" namespace={namespace} onClick={setPage} onDelete={onSave}>configured surface builder</StatsTitle>
        
        <StatsTitle type="dimension" namespace={namespace} onClick={setPage} onDelete={onSave}>custom dimension</StatsTitle>
        <StatsTitle type="noise" namespace={namespace} onClick={setPage} onDelete={onSave}>custom noise</StatsTitle>
        <StatsTitle type="dimension_type" namespace={namespace} onClick={setPage} onDelete={onSave} invisible={true}>custom dimension type</StatsTitle>
        
        <StatsTitle type="processor" namespace={namespace} onClick={setPage} onDelete={onSave}>custom processor list</StatsTitle>
        <StatsTitle type="carver" namespace={namespace} onClick={setPage} onDelete={onSave} invisible={true}>custom carver</StatsTitle>
        <div>
        </div>
    </div>
}

function StatsTitle({ children, type, invisible = false, namespace, onClick, onDelete }) {
    const data = useContext(DataContext).custom[type + 's'];
    if (invisible && data.length < 1) {
        return <></>
    }

    const handleRemove = function (e, data) {
        e.preventDefault();
        if (window.confirm('Do you really want to remove this resource?')) {
            delete data.key;
            onDelete(type, data);
        }
    };

    return <div className="card">
        <h5><strong>{data.length}</strong> {children}{data.length > 1 && 's'}</h5>
        <ul>
            {data.map((d, i) => {
                const name = displayNamespacedKey(d.key, namespace);
                return <li key={i}><a href="#remove" onClick={e => handleRemove(e, d)}><i className="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/></svg></i></a><a href="#edit" onClick={e => onClick(e, type, i)}>{name}</a></li>
            })}
        </ul>
    </div>
}