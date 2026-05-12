import { test, expect } from '@playwright/test';

test('Black-Box: User can open the Create Account modal', async ({ page }) => {
  // 1. Go to the accounts page
  await page.goto('/accounts'); // Adjust path if your route is different

  // 2. Click the "+" button or the "Open New Account" dashed button
  // In your code, this button has the text "+ Open New Account"
  await page.click('text=+ Open New Account');

  // 3. Verify the Modal is visible
  const modalTitle = page.locator('h3:has-text("Open New Account")');
  await expect(modalTitle).toBeVisible();

  // 4. Test the dropdown (Functional check)
  await page.selectOption('select', 'Investment');
  await page.click('text=Continue');

  // 5. Verify we reached the Terms & Conditions step
  await expect(page.locator('text=Terms & Conditions')).toBeVisible();
});