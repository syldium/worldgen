import React, { useCallback } from 'react';
import { useToggle } from '../../hook/useToggle';
import { Obj, removeReactKeys } from '../../util/DomHelper';
import { Schema } from '../../model/Registry';
import { JsonView } from 'json-view-for-react';
import { Modal } from './Modal';
import { Code } from 'react-feather';

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
      <i className="mls">
        <Code onClick={toggleModal} />
      </i>
      {open && (
        <Modal isOpen={open} onClose={closeModal}>
          <JsonView obj={obj()} />
        </Modal>
      )}
    </>
  );
}
