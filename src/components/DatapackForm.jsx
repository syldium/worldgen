import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { readZip } from '../utils/zip';

export function DatapackForm({onCreate}) {

    const [error, setError] = useState(null);

    const handleCreate = function(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const namespace = data.get('namespace');
        onCreate([namespace, undefined]);
    };

    const handleFile = function(e) {
        e.preventDefault();
        e.stopPropagation();
        const file = (e.dataTransfer || e.target).files[0];
        readZip(file)
            .then(onCreate)
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    };
    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
    };

    return <form onSubmit={handleCreate} onDragStart={handleDrag} onDragEnter={handleDrag} onDragOver={handleDrag} onDrop={handleFile}>
        <h2>Create a new dimension datapack</h2>
        <div className="form-group">
            <label htmlFor="namespace">Default namespace</label> : <input type="text" name="namespace" id="namespace" required pattern="[a-z0-9._-]+" className="form-control" aria-describedby="namespaceHelp" />
            <p><small id="namespaceHelp" className="form-text text-muted">This differentiates the datapack from the vanilla functions. Namespaces and identifiers may only contain letters, numbers and <code>._-</code> characters. This namespace is not final, you can edit the vanilla dimensions in the following menus.</small></p>
        </div>
        <div className="flex-container">
            <Button type="submit">Create</Button>
            <input type="file" name="load-existing-zip" id="load-existing-zip" accept=".zip" onChange={handleFile} /><label htmlFor="load-existing-zip" className="btn--info">Use existing datapack</label>
        </div>
        {error !== null && <div className="mtl">
            <div className="alert--danger">{error}</div>
        </div>}
        <div className="mtl">
            <div className="alert--warning">
                This generator as well as the in-game functionality is unstable. Use this tool with caution.<br />
                Currently built for pre-release 1. Datapacks created in snapshots will be converted to work in this pre-release.
            </div>
        </div>
    </form>
}