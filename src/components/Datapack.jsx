import {
    Link,
    Route,
    Switch,
    useHistory,
    useParams
} from 'react-router-dom';
import React, { Suspense, lazy, useCallback, useContext, useEffect } from 'react';

import { Button } from '../ui/Button';
import { ConfiguredCarverForm } from './carver/ConfiguredCarver';
import { DataContext } from '../context/DataContext';
import { DatapackForm } from './DatapackForm';
import { DimensionTypeForm } from './dimension/DimensionType';
import { Modal } from '../ui/Modal';
import { NavBar } from '../ui/Menu';
import { NoiseSettings } from './noise/NoiseSettings';
import { ProcessorList } from './processor/ProcessorList';
import { SurfaceBuilder } from './surface/SurfaceBuilder';
import { buildZip } from '../utils/zip';
import { displayNamespacedKey } from '../utils/data';
import { useSave } from '../hooks/context';
import { useToggle } from '../hooks/ui';
import Masonry from 'masonry-layout';

const Biome = lazy(() => import('./biome/Biome'));
const Dimension = lazy(() => import('./dimension/Dimension'));
const ConfiguredFeature = lazy(() => import('./feature/ConfiguredFeature'));

export function Datapack({ onCreate }) {
    const context = useContext(DataContext);
    const custom = context.custom;
    const namespace = context.namespace;
    const history = useHistory();
    const [open, toggleModal] = useToggle();

    const setPage = useCallback(function (e, page, index) {
        e.preventDefault();
        history.push(page + '/' + index);
    }, [history]);
    const handleNamespaceChange = useCallback(function (s) {
        onCreate(s);
        toggleModal();
    }, [onCreate, toggleModal]);
    const handleGenerateClick = useCallback(function (e) {
        e.preventDefault();
        buildZip(custom);
    }, [custom]);

    return <div>
        <NavBar>
            <nav className="tabs"><ul>
                <li><Link to="/">Main</Link></li>
                <li><Link to="/biome">Biome</Link></li>
                <li><Link to="/surface">Surface builder</Link></li>
                <li><Link to="/feature">Feature</Link></li>
                <li><Link to="/dimension">Dimension</Link></li>
                <li><Link to="/noise">Noise</Link></li>
                <li><Link to="/processor">Processor</Link></li>
            </ul></nav>
        </NavBar>
        {open && <Modal open={open} onClose={toggleModal}>
            <DatapackForm onCreate={handleNamespaceChange} nav={false}></DatapackForm>
        </Modal>}
        <div className="content"><Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/">
                    <h2>Datapack <code onClick={toggleModal}>{namespace}</code> <Button type="submit" onClick={handleGenerateClick}>Generate</Button></h2>
                    <Main custom={custom} namespace={namespace} setPage={setPage} />
                </Route>
                <Route path="/biome/:id?">
                    <Resource component={Biome} type="biome" />
                </Route>
                <Route path="/carver/:id?">
                    <Resource component={ConfiguredCarverForm} type="carver" />
                </Route>
                <Route path="/surface/:id?">
                    <Resource component={SurfaceBuilder} type="surface" />
                </Route>
                <Route path="/feature/:id?">
                    <Resource component={ConfiguredFeature} type="feature" />
                </Route>
                <Route path="/noise/:id?">
                    <Resource component={NoiseSettings} type="noise" />
                </Route>
                <Route path="/processor/:id?">
                    <Resource component={ProcessorList} type="processor" />
                </Route>
                <Route path="/dimension/:id?">
                    <Resource component={Dimension} type="dimension" />
                </Route>
                <Route path="/dimension/type/:id?">
                    <Resource component={DimensionTypeForm} type="dimension_type" />
                </Route>
            </Switch>
        </Suspense></div>
    </div>
}

function Resource({ component, type }) {
    const history = useHistory();
    const custom = useContext(DataContext).custom;
    const { id } = useParams();

    return React.createElement(component, { data: custom[type + 's'][id], onSave: useSave(type, history, id) })
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

function StatsTitle({ children, type, invisible = false, namespace }) {
    const data = useContext(DataContext).custom[type + 's'];
    const remove = useSave(type, useHistory());
    if (invisible && data.length < 1) {
        return <></>
    }

    const handleRemove = function (e, data) {
        e.preventDefault();
        if (window.confirm('Do you really want to remove this resource?')) {
            delete data.key;
            remove(data);
        }
    };

    return <div className="card">
        <h5><strong>{data.length}</strong> {children}{data.length > 1 && 's'}</h5>
        <ul>
            {data.map((d, i) => {
                const name = displayNamespacedKey(d.key, namespace);
                return <li key={i}>
                    <a href="#remove" onClick={e => handleRemove(e, d)}>
                        <i className="delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/></svg></i>
                    </a>
                    <Link to={type.replace('_', '/') + '/' + i}>{name}</Link>
                </li>
            })}
        </ul>
    </div>
}
