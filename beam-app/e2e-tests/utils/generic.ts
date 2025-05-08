/** Contains generic utility functions */
import { Page } from '@playwright/test';

import { baseUrl } from '../settings';

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Generates and returns an email address in the E2E address pool */
export function generateEmailAddress(): string {
  return `testing+${Date.now()}@onbeam.com`;
}

/**
 * Sets the cookie for avoiding the conset dialog.
 * The function needs to be called before you open a page which could have the consent dialog
 */
export async function setConsentCookie({ page }: { page: Page }) {
  const consentObj = {
    version: 1,
    state: {
      ad_personalization: true,
      ad_storage: true,
      ad_user_data: true,
      analytics_storage: true,
      functionality_storage: true,
    },
  };

  await page.context().addCookies([
    {
      url: baseUrl,
      name: 'beam_cookie_consent',
      value: JSON.stringify(consentObj),
    },
  ]);
}
