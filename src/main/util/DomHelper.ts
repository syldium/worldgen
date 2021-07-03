import { nanoid } from 'nanoid';

export type Obj = Record<string, unknown>;

export interface ReactKeyed {
  __reactKey: string;
}

/**
 * Adds a unique key to the object without creating a new one.
 * @param record
 */
export function addReactKey<T extends Obj>(record: T): T & ReactKeyed {
  if ('__reactKey' in record) {
    return record as T & ReactKeyed;
  }
  (record as T & ReactKeyed).__reactKey = nanoid();
  return record as T & ReactKeyed;
}
