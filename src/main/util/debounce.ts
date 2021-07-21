/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(fn: (...params: any[]) => any, time = 30): typeof fn {
  let timer = -1;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn.apply(this, args), time);
    return timer;
  };
}
