/** Contains utility functions related to the landing home page */
import { Page, expect } from '@playwright/test';

/** Opens the home page */
export async function openHomePage(page: Page) {
  // waitUntil is due to the page loading indefinitely for some reason
  await page.goto('', { waitUntil: 'domcontentloaded' });
}

/** Asserts that the account address within the user menu sign in button is correct (it is only visible partially) */
export async function assertUserMenuAccountAddressIsCorrect({
  page,
  accountAddress,
}: {
  page: Page;
  accountAddress: string;
}) {
  await expect(page.getByTestId('sign-in-button')).toHaveText(
    new RegExp(`^0x.*${accountAddress.slice(-4)}$`),
  );
}
