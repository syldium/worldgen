import { JsonView } from 'json-view-for-react';
import { ReactElement, useCallback } from 'react';
import { Code } from 'react-feather';
import { useToggle } from '../../hook/useToggle';
import type { Schema } from '../../model/Registry';
import { Obj, removeReactKeys } from '../../util/DomHelper';
import { Modal } from './Modal';

interface JsonViewerProps {
  data: Schema | (() => Schema);
}
export function JsonViewer({ data }: JsonViewerProps): ReactElement {
  const [open, toggleModal] = useToggle(false);
  const closeModal = useCallback(() => toggleModal(false), [toggleModal]);

  const obj = useCallback(
    () => removeReactKeys((data instanceof Function ? data() : data) as Obj),
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
