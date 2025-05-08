import { test as setup, expect } from '@playwright/test';

import { STORAGE_STATE_JSON } from '../../playwright.config';

import { isPreview, vercelPassword } from '../settings';
import { generateEmailAddress, setConsentCookie } from '../utils/generic';
import { openHomePage } from '../utils/home';
import { createBeamAccount } from '../utils/signIn/beam';

setup('Sign in via a Beam wallet', async ({ page }) => {
  const emailAddress = generateEmailAddress();

  await setConsentCookie({ page });

  await setup.step(
    'Login to Vercel (if needed) and open the homepage',
    async () => {
      await openHomePage(page);

      if (isPreview) {
        await page.locator('input[type="password"]').fill(vercelPassword);
        await page.locator('button').click();
      }
    },
  );

  await setup.step('Create a Beam account', async () => {
    await createBeamAccount({ page, emailAddress: emailAddress });

    await expect(page.locator('h2', { hasText: 'My Tokens' })).toBeVisible();
  });

  await setup.step(
    'Finish global setup by saving the storage state and user data',
    async () => {
      await page.context().storageState({ path: STORAGE_STATE_JSON });
    },
  );
});
