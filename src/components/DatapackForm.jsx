import React, { useContext, useState } from 'react';

import { Button } from '../ui/Button';
import { DataContext } from '../context/DataContext';
import { NavBar } from '../ui/Menu';
import { readZip } from '../utils/zip';

export function DatapackForm({ nav = true, onCreate }) {

    const context = useContext(DataContext);
    const [error, setError] = useState(null);

    const handleCreate = function(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const namespace = data.get('namespace');
        onCreate(namespace);
    };

    const handleFile = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const file = (e.dataTransfer || e.target).files[0];
        readZip(file)
            .then(([namespace, initial]) => {
                onCreate(namespace);
                context.custom.resetAll(initial);
            })
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    };
    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };

    window.scrollTo(0, 0);

    return <div className="first-screen" onDragStart={handleDrag} onDragEnter={handleDrag} onDragOver={handleDrag} onDrop={handleFile}>
        {nav && <NavBar><h2>Dimension datapack generator</h2></NavBar>}
        {nav || <h2>Clean workplace</h2>}
        <form onSubmit={handleCreate}>
            <div className="form-control">
                {nav && <div className="mbm">
                    <h3>What's this?</h3>
                    <p className="mbm" style={{ fontSize: '0.95rem' }}>
                        This online generator under development allows you to create world generation datapacks for Minecraft 1.16.5. You'll be able to create your own biomes or edit existing ones, custom trees, change the amplitude of the terrain, mix generated blocks and more in the following menus. To continue, choose your datapack identifier.
                    </p>
                    <hr />
                </div>}
                <label htmlFor="namespace">Default namespace</label><br />
                <input type="text" name="namespace" id="namespace" required pattern="[a-z0-9._-]+" autoCapitalize="none" spellCheck="false" autoComplete="off" aria-describedby="namespaceHelp" defaultValue={context.namespace} />
                <p className="help2"><small id="namespaceHelp" className="form-text text-muted">This differentiates the datapack from the vanilla functions. Namespaces and identifiers may only contain letters, numbers and <code>._-</code> characters. This namespace is not final, you can edit the vanilla dimensions in the following menus.</small></p>
                <div className="actions">
                    <Button type="submit">Create</Button>
                    <input type="file" name="load-existing-zip" id="load-existing-zip" accept=".zip" onChange={handleFile} tabIndex="0" /><label htmlFor="load-existing-zip" className="btn--info">Use existing datapack</label>
                </div>
                <div className="mtm">
                    {error !== null && <div className="alert--danger">{error}</div>}
                    <p className="alert--warning">
                        This generator is currently built for 1.16.5.
                    </p>
                </div>
            </div>
        </form>
    </div>
}
