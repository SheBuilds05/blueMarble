import { test, expect } from 'vitest';
import { validateAccountType } from './accounts';

test('White-Box: should allow valid bank account types', () => {
  expect(validateAccountType('Savings')).toBe(true);
  expect(validateAccountType('Investment')).toBe(true);
});

test('White-Box: should reject invalid account types', () => {
  expect(validateAccountType('Credit Card')).toBe(false);
  expect(validateAccountType('Bitcoin')).toBe(false);
});