import { test, expect } from '@playwright/test';

test('Black-Box: User can complete a transaction', async ({ page }) => {
  await page.goto('/dashboard');
  await page.fill('#transfer-amount', '500');
  await page.click('#send-button');
  
  // Checking the result, not the code
  await expect(page.locator('.status')).toHaveText('Transaction Successful');
});