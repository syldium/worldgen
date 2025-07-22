import { ReactElement, useCallback } from 'react';
import { Code } from 'react-feather';
import { JsonView } from 'react-json-view-lite';
import type { StyleProps } from 'react-json-view-lite/dist/DataRenderer';
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
          <JsonView data={obj()} style={darkStyles} />
        </Modal>
      )}
    </>
  );
}

const darkStyles: Partial<StyleProps> = {
  container: 'jsonview-code',
  basicChildStyle: 'basic-element-style',
  childFieldsContainer: 'child-fields-container',
  label: 'label-dark',
  clickableLabel: 'clickable-label-dark',
  nullValue: 'value-null-dark',
  undefinedValue: 'value-undefined-dark',
  stringValue: 'value-string-dark',
  booleanValue: 'value-boolean-dark',
  numberValue: 'value-number-dark',
  otherValue: 'value-other-dark',
  punctuation: 'punctuation-dark',
  collapseIcon: 'collapse-icon-dark',
  expandIcon: 'expand-icon-dark',
  collapsedContent: 'collapsed-content-dark',
  quotesForFieldNames: true
};
