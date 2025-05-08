import { test, expect } from '@playwright/test';

test('homepage should load and render the text', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h2', { hasText: 'My Tokens' })).toBeVisible();
});
