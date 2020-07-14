import React, { useState } from 'react';
import './../node_modules/knacss/css/knacss.css';
import './App.css';
import { Datapack } from './components/Datapack';
import { DataContextProvider } from './context/DataContext';
import { DatapackForm } from './components/DatapackForm';

function App() {
    const [namespace, setNamespace] = useState(null);

    return <>
        {namespace !== null ? <DataContextProvider namespace={namespace}><Datapack /></DataContextProvider> : <DatapackForm onCreate={setNamespace} />}
    </>
}

export default App;
