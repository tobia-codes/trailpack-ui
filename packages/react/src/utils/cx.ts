export type ClassValue = string | false | null | undefined;

/** Joins class names, dropping the falsy ones. */
export const cx = (...values: ClassValue[]) => values.filter(Boolean).join(' ');
