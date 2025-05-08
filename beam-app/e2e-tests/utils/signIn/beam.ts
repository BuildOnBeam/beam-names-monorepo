/** Contains utility functions for signing in to Sphere via beam wallet */
import { Page, expect } from '@playwright/test';

import { DEFAULT_EXPECT_TIMEOUT } from '../../../playwright.config';
import { retrieveOTPFromEmail } from './gmailUtils';

/** Opens the Beam Wallet login popup and returns its Page object */
async function openBeamWalletLoginPopup({
  page,
}: { page: Page }): Promise<Page> {
  // if the 'Connect your wallet' is not opened already
  if (await page.locator('[data-testid$="option-com.onbeam"]').isHidden()) {
    await page.locator('header button', { hasText: 'connect wallet' }).click();
  }

  const popupPromise = page.waitForEvent('popup');
  await page.locator('[data-testid$="option-com.onbeam"]').click();
  const popup = await popupPromise;

  return popup;
}

/** Fills in the OTP code on the login confirmation code and verifies the state of the page afterwards */
export async function fillOTPOnConfirmationPage({
  page,
  emailAddress,
  otp,
  isSuccessful,
}: {
  page: Page;
  emailAddress: string;
  otp: string;
  isSuccessful: boolean;
}) {
  await expect(
    page.locator('p', {
      hasText: `enter the 6-digit code sent to ${emailAddress}`,
    }),
  ).toBeVisible();

  await page.getByTestId('otp-input').fill(otp.toString());
  await expect(page.getByTestId('otp-input')).toHaveValue(otp);

  if (isSuccessful) {
    // TODO: remove increased timeout once https://onbeam2.slack.com/archives/C054AQY5SQ5/p1733734208572619 is resolved
    await expect(page.locator('button[label="confirm"]')).toBeVisible({
      timeout: DEFAULT_EXPECT_TIMEOUT * 3,
    });
  } else {
    await expect(page.locator('span.beam-errorMessage')).toHaveText(
      'token has expired or is invalid',
    );
  }
}

/**
 * Creates a Beam Identity (wallet) account by clicking on Sign In > Beam and registering a new email.
 * This involves retrieving the OTP from the sent email and filling it in
 */
export async function createBeamAccount({
  page,
  emailAddress,
  confirmRequest = true,
}: {
  page: Page;
  emailAddress: string;
  confirmRequest?: boolean;
}) {
  const popUp = await openBeamWalletLoginPopup({ page });

  await popUp.locator('input#email').fill(emailAddress);
  await popUp.getByTestId('email-login-button').click();

  await fillOTPOnConfirmationPage({
    page: popUp,
    emailAddress,
    otp: await retrieveOTPFromEmail({
      to: emailAddress,
      subject: 'confirm your registration to beam',
    }),
    isSuccessful: true,
  });

  confirmRequest && (await popUp.locator('button[label="confirm"]').click());
}

/**
 * Connects (logs in) an existing Beam Identity (wallet) account.
 * This involves retrieving the OTP from the sent email and filling it in
 */
export async function connectBeamAccount({
  page,
  emailAddress,
  confirmRequest = true,
}: {
  page: Page;
  emailAddress: string;
  confirmRequest?: boolean;
}) {
  const popUp = await openBeamWalletLoginPopup({ page });

  await popUp.locator('input#email').fill(emailAddress);
  await popUp.getByTestId('email-login-button').click();

  await fillOTPOnConfirmationPage({
    page: popUp,
    emailAddress,
    otp: await retrieveOTPFromEmail({
      to: emailAddress,
      subject: 'your one time log-in to beam',
    }),
    isSuccessful: true,
  });

  confirmRequest && (await popUp.locator('button[label="confirm"]').click());
}
