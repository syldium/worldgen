import React, { useCallback } from 'react';
import { useToggle } from '../../hook/useToggle';
import { Obj, removeReactKeys } from '../../util/DomHelper';
import { Schema } from '../../model/Registry';
import { JsonView } from 'json-view-for-react';
import { Modal } from './Modal';

interface JsonViewerProps {
  data: Schema | (() => Schema);
}
export function JsonViewer({ data }: JsonViewerProps): JSX.Element {
  const [open, toggleModal] = useToggle(false);
  const closeModal = useCallback(() => toggleModal(false), [toggleModal]);

  const obj = useCallback(
    () => removeReactKeys((typeof data === 'object' ? data : data()) as Obj),
    [data]
  );

  return (
    <>
      <i className="code mls" onClick={toggleModal}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M.7 9.3l4.8-4.8 1.4 1.4-4 4.1 4 4-1.4 1.5L0 10l.7-.7zm18.6 1.4l.7-.7-5.5-5.5L13.1 6l4 4.1-4 4 1.4 1.5 4.8-4.8z" />
        </svg>
      </i>
      {open && (
        <Modal isOpen={open} onClose={closeModal}>
          <JsonView obj={obj()} />
        </Modal>
      )}
    </>
  );
}
