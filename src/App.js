import './styles/App.scss';

import React, { useCallback } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { DataContextProvider } from './context/DataContext';
import { Datapack } from './components/Datapack';
import { DatapackForm } from './components/DatapackForm';
import createPersistedState from 'use-persisted-state';

const useNamespaceState = createPersistedState('namespace');
function App() {
    const [namespace, setNamespace] = useNamespaceState(null);

    const handleCreation = useCallback(function (namespace) {
        setNamespace(namespace);
    }, [setNamespace]);

    return <DataContextProvider namespace={namespace}>
            {namespace === null ?
                <DatapackForm onCreate={handleCreation} />
                :
                <BrowserRouter basename={process.env.PUBLIC_URL}><Datapack onCreate={handleCreation} /></BrowserRouter>
            }
    </DataContextProvider>
}

export default App;
