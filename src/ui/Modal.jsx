import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import useModal from '@delangle/use-modal';
import { Button } from './Button';

export const Modal = ({ children, open, onClose }) => {
    const modal = useModal({ open, onClose: () => onClose(false) });

    const el = document.createElement('div');
    el.classList.add('modal-wrapper');

    useEffect(() => {
        document.body.appendChild(el);
        return () => document.body.removeChild(el);
    }, [el]);

    return createPortal(
        <dialog open={modal.state === 'opened'}>
            <Button cat="close" onClick={onClose}></Button>
            {children}
        </dialog>
    , el);
}