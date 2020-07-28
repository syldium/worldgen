import React, { useState } from 'react';
import './../node_modules/knacss/css/knacss.css';
import './App.css';
import { Datapack } from './components/Datapack';
import { DataContextProvider } from './context/DataContext';
import { DatapackForm } from './components/DatapackForm';

function App() {
    const [data, setData] = useState(null);

    return <>
        {data !== null ? <DataContextProvider namespace={data[0]} initial={data[1]}><Datapack /></DataContextProvider> : <DatapackForm onCreate={setData} />}
    </>
}

export default App;
