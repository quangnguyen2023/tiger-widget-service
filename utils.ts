import { isDate } from 'class-validator';

export function numberToTimestamp(
  value: number | Date,
  isSeconds: boolean = true, // seconds or miliseconds?
  toISOString: boolean = false,
): Date | string {
  if (isDate(value)) return value;

  const ms = isSeconds ? value * 1000 : value;
  const date = new Date(ms);
  return toISOString ? date.toISOString() : date;
}
