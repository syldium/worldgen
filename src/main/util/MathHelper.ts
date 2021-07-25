// https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Integer.html
export const INT_MAX_VALUE = 0x7fffffff;
export const INT_MIN_VALUE = 0x80000000 & 0x80000000;

// https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Long.html
export const LONG_MAX_VALUE = 0x7fffffffffffffff; // > Number.MAX_SAFE_INTEGER
export const LONG_MIN_VALUE = -LONG_MAX_VALUE - 1; // < Number.MIN_SAFE_INTEGER

// https://docs.oracle.com/en/java/javase/16/docs/api/java.base/java/lang/Float.html
export const FLOAT_MAX_VALUE = (2 - 2 ** -23) * 2 ** 127;
export const FLOAT_MIN_VALUE = -FLOAT_MAX_VALUE;

/**
 * Check that the number is within an interval.
 *
 * @param value The value to test
 * @param min A minimum bound (inclusive)
 * @param max A maximum bound (inclusive)
 * @param step
 */
export function isInRange(
  value: number,
  min: number = INT_MIN_VALUE,
  max: number = INT_MAX_VALUE,
  step?: number
): boolean {
  if (!Number.isFinite(value)) {
    return false;
  }
  if (value < min || value > max) {
    return false;
  }
  if (step) {
    return value % step === 0;
  }
  return true;
}

export function isNumeric(value: string): boolean {
  return !isNaN(parseInt(value));
}

export function isNumericChar(value: string, index: number): boolean {
  const code = value.charCodeAt(index);
  return code > 47 && code < 58;
}

/**
 * Tests if it is a sequence of consecutive integers.
 *
 * @param values
 */
export function areConsecutiveIntegers(values: readonly string[]): boolean {
  let i = 0;
  let prev = parseInt(values[i++]);
  while (!isNaN(prev) && i < values.length) {
    const int = parseInt(values[i++]);
    if (prev + 1 !== int) {
      return false;
    }
    prev = int;
  }
  return i === values.length;
}

export function mod(a: number, b: number): number {
  const remain = a % b;
  return remain < 0 ? remain + b : remain;
}
