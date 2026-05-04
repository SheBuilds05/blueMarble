import { calculateInterest } from './account';

test('White-Box: should calculate 5% interest correctly', () => {
  const result = calculateInterest(1000, 0.05);
  expect(result).toBe(50); // Direct internal logic check
});