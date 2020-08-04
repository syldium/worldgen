import React, { useContext } from 'react';
import { Biome } from './biome/Biome';
import { Button } from './../ui/Button';
import { MenuItem, NavBar } from './../ui/Menu';
import { Dimension } from './dimension/Dimension';
import { DataContext } from './../context/DataContext';
import { RawConfiguredFeature } from './feature/ConfiguredFeature';
import { capitalize } from '../utils/data';
import { buildZip } from '../utils/zip';
import { SurfaceBuilder } from './surface/SurfaceBuilder';
import { NoiseSettings } from './noise/NoiseSettings';
import { displayNamespacedKey } from '../utils/data';
import { useMenu } from '../hooks/ui';

export function Datapack() {
    const context = useContext(DataContext);
    const custom = context.custom;
    const namespace = context.namespace;
    const [page, index, setMenu] = useMenu();

    const handleSave = function (type, data) {
        const method = 'update' + (type === 'surface' ? 'SurfacesBuilder' : capitalize(type)) + 's'
        custom[method](data);
        setMenu(null);
        window.scrollTo(0, 0);
    }

    return <div>
        <NavBar>
            <nav className="tabs"><ul>
                <MenuItem onClick={e => setMenu(e, 'stats')} active={page === 'stats'}>Stats</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'biome')} active={page === 'biome'}>Biome</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'surface')} active={page === 'surface'}>Surface builders</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'feature')} active={page === 'feature'}>Feature</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'dimension')} active={page === 'dimension'}>Dimension</MenuItem>
                <MenuItem onClick={e => setMenu(e, 'noise')} active={page === 'noise'}>Noise</MenuItem>
            </ul></nav>
        </NavBar>
        <div className="content">
            {page === 'biome' && <Biome onSave={biome => handleSave('biome', biome)} data={custom.biomes[index]} />}
            {page === 'surface' && <SurfaceBuilder onSave={surface => handleSave('surface', surface)} data={custom.surfaces[index]} />}
            {page === 'feature' && <RawConfiguredFeature onSave={feature => handleSave('feature', feature)} data={custom.features[index]} />}
            {page === 'noise' && <NoiseSettings onSave={noise => handleSave('noise', noise)} data={custom.noises[index]} />}
            {page === 'dimension' && <Dimension onSave={dimension => handleSave('dimension', dimension)} data={custom.dimensions[index]} />}
            {page === 'stats' && <><h2>Datapack {namespace}</h2><Stats custom={custom} namespace={namespace} setPage={setMenu} /></>}
        </div>
    </div>
}

function Stats({custom, namespace, setPage}) {

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
        <StatsTitle data={custom.biomes} namespace={namespace} onClick={(e, i) => setPage(e, 'biome', i)}>custom biome</StatsTitle>
        <StatsTitle data={custom.dimensions} namespace={namespace} onClick={(e, i) => setPage(e, 'dimension', i)}>custom dimension</StatsTitle>
        <StatsTitle data={custom.features} namespace={namespace} onClick={(e, i) => setPage(e, 'feature', i)}>configured feature</StatsTitle>
        <StatsTitle data={custom.surfaces} namespace={namespace} onClick={(e, i) => setPage(e, 'surface', i)}>configured surface builder</StatsTitle>
        <StatsTitle data={custom.noises} namespace={namespace} onClick={(e, i) => setPage(e, 'noise', i)}>custom noise</StatsTitle>
        {mayGenerate && <p><Button type="submit" onClick={handleGenerateClick}>Generate</Button></p>}
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