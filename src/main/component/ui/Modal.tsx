import useModal, { ModalState } from '@delangle/use-modal';
import type { MouseEvent, ReactNode } from 'react';
import { ReactElement, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { voidReturn } from '../../util/DomHelper';

interface ModalProps {
  children?: ReactNode;
  isOpen: boolean;
  onClose: (opened: MouseEvent<HTMLButtonElement> | boolean) => void;
}
export function Modal({ children, isOpen, onClose }: ModalProps): ReactElement {
  const modal = useModal<HTMLDialogElement>({
    open: isOpen,
    onClose: useMemo(() => () => onClose(false), [onClose])
  });

  const el = document.createElement('div');
  el.classList.add('modal-wrapper');

  useEffect(() => {
    document.body.appendChild(el);
    return voidReturn(() => document.body.removeChild(el));
  }, [el]);

  return createPortal(
    <dialog open={modal.state === ModalState.opened}>
      <button className="btn--close" onClick={onClose} />
      {children}
    </dialog>,
    el
  );
}
