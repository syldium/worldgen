import './styles/App.scss';
import React, { useState } from 'react';
import { DataContextProvider } from './context/DataContext';
import { Datapack } from './components/Datapack';
import { DatapackForm } from './components/DatapackForm';

function App() {
    const [data, setData] = useState(null);

    return <>
        {data !== null ?
            <DataContextProvider namespace={data[0]} initial={data[1]}>
                <Datapack />
            </DataContextProvider>
            :
            <DatapackForm onCreate={setData} />
        }
    </>
}

export default App;
