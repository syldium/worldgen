export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  fn: F,
  time: number = 30
): (...args: Parameters<F>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function<T> (this: T, ...args: Parameters<F>): void {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), time);
  };
}
