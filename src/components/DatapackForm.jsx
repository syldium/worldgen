import React from 'react';
import { Button } from '../ui/Button';

export function DatapackForm({onCreate}) {

    const handleCreate = function(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const namespace = data.get('namespace');
        onCreate(namespace);
    };

    return <form onSubmit={handleCreate}>
        <h2>Create a new dimension datapack</h2>
        <div className="form-group">
            <label htmlFor="namespace">Namespace</label> : <input type="text" name="namespace" id="namespace" required pattern="[a-z0-9._-]+" className="form-control" aria-describedby="namespaceHelp" />
            <p><small id="namespaceHelp" className="form-text text-muted">This differentiates the datapack from the vanilla functions. Namespaces and identifiers may only contain letters, numbers and <code>._-</code> characters.</small></p>
        </div>
        <Button type="submit">Create</Button>
        <div className="mtl">
            <div className="alert--warning">
                This generator as well as the in-game functionality is unstable. Use this tool with caution.<br />
                Currently built for snapshot 20w30a.
            </div>
        </div>
    </form>
}