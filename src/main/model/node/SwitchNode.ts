import { stripDefaultNamespace } from '../../util/LabelHelper';
import { ModelNode, NodeBase } from './Node';

export interface SwitchNodeParams extends NodeBase<'switch'> {
  records: Record<string, ModelNode>;
  config: string | null;
  preset: { [type in string]: Record<string, unknown> & Typed };
}

function isTyped(value: unknown): value is Record<string, unknown> & Typed {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.prototype.hasOwnProperty.call(value, 'type')
  );
}

/**
 * Creates a node with a <code>type</code> field defining which node from <code>records</code> to use.
 *
 * @param records
 * @param preset
 * @param config
 */
export const SwitchNode = (
  records: Record<string, ModelNode>,
  preset: Record<keyof typeof records, Record<string, unknown> & Typed> = {},
  config: string | null = 'config'
): SwitchNodeParams => ({
  records,
  preset,
  config,
  type: 'switch',
  isValid: (value: unknown) => {
    if (!isTyped(value) || (config && !value[config])) {
      return false;
    }
    return stripDefaultNamespace(value.type) in records;
  }
});

export interface Typed {
  type: string;
}
