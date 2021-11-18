import { MessageChannel, receiveMessageOnPort } from 'worker_threads';

const { port1, port2 } = new MessageChannel();

/**
 * Deep clone a value (https://developer.mozilla.org/en-US/docs/Web/API/structuredClone).
 *
 * @param obj
 */
export function structuredClone<T>(obj: T): T {
  port1.postMessage(obj);
  return receiveMessageOnPort(port2)!.message;
}
