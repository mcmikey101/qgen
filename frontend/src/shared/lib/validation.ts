export type Validator = (value: string) => string | null;

export function validate(value: string, ...validators: Validator[]): string | null {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
}

export function required(message: string): Validator {
  return value => value.trim() ? null : message;
}

export function maxLength(limit: number): Validator {
  return value => value.length <= limit ? null : `Максимум ${limit} символов`;
}

export const email: Validator = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Введите корректный email';

export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some(Boolean);
}
