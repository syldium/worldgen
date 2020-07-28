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
        const file = e.target.files[0];
        readZip(file)
            .then(onCreate)
            .catch(error => {
                console.error(error);
                setError(error.message);
            });
    };

    return <form onSubmit={handleCreate}>
        <h2>Create a new dimension datapack</h2>
        <div className="form-group">
            <label htmlFor="namespace">Namespace</label> : <input type="text" name="namespace" id="namespace" required pattern="[a-z0-9._-]+" className="form-control" aria-describedby="namespaceHelp" />
            <p><small id="namespaceHelp" className="form-text text-muted">This differentiates the datapack from the vanilla functions. Namespaces and identifiers may only contain letters, numbers and <code>._-</code> characters.</small></p>
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
                Currently built for snapshot 20w30a.
            </div>
        </div>
    </form>
}