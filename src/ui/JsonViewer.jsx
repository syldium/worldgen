import React, { useCallback } from 'react';

import { JsonView } from 'json-view-for-react'
import { Modal } from './Modal';
import { useToggle } from '../hooks/ui';

export function JsonViewer({ data }) {
    const [open, toggleModal] = useToggle();

    const obj = useCallback(function () {
        const obj = typeof data === 'object' ? { ...data } : data();
        delete obj.key;
        delete obj.index;
        return obj;
    }, [data]);

    return <>
        <i className="code mls" onClick={toggleModal}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M.7 9.3l4.8-4.8 1.4 1.4-4 4.1 4 4-1.4 1.5L0 10l.7-.7zm18.6 1.4l.7-.7-5.5-5.5L13.1 6l4 4.1-4 4 1.4 1.5 4.8-4.8z"/></svg></i>
        {open &&
            <Modal open={open} onClose={toggleModal}><JsonView obj={obj()} /></Modal>
        }
    </>
}
