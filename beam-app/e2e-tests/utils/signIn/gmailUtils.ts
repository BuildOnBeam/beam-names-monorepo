/** Contains functions for working with a Google Mail account using the Google API */
import fs from 'node:fs';

import { expect } from '@playwright/test';
import { google } from 'googleapis';
import { sleep } from '../generic';

import {
  gmailApiAccesTokenPath,
  googleApiOauth2CredentialsPath,
} from '../../settings';

const oauth2Credentials = JSON.parse(
  fs.readFileSync(googleApiOauth2CredentialsPath, 'utf-8'),
).installed;
const tokens = JSON.parse(fs.readFileSync(gmailApiAccesTokenPath, 'utf-8'));

const googleOauth2Client = new google.auth.OAuth2(
  oauth2Credentials.client_id,
  oauth2Credentials.client_secret,
  oauth2Credentials.redirect_uris,
);
googleOauth2Client.setCredentials({ ...tokens });

const gmail = google.gmail({ version: 'v1', auth: googleOauth2Client });

/**
 * Returns the latest email (from the inbox of the email address corresponding to the access token) with the specified
 * recipient & subject the inbox of the email address corresponding to the access token.
 *
 * Returns undefined if no email is found within the specified timeout. Otherwise, returns the email content as a
 * string snippet which usually contains all the info we need (can be upgraded to return the whole body if needed).
 */
export async function getLatestEmailBySubject({
  to,
  subject,
  timeout = 30_000,
  pollInterval = 1_000,
}: {
  to: string;
  subject: string;
  timeout?: number;
  pollInterval?: number;
}): Promise<string | undefined> {
  for (let i = 0; i < timeout / pollInterval; i++) {
    const msgs = (
      await gmail.users.messages.list({
        userId: 'me',
        q: `to:${to} subject:"${subject}"`,
      })
    ).data.messages;

    // if no emails are found/latest one does not have a snippet, sleep and contiue
    if (!msgs || !msgs.length) {
      await sleep(pollInterval);
    } else {
      // if in the future we want the full HTML body of the email
      // const base64URLBody = (await gmail.users.messages.get({ userId: 'me', id: msgs[0].id! })).data.payload.body
      // const base64Body = base64URLBody.data.replace(/-/g, '+').replace(/_/g, '/')
      // const stringBody = Buffer.from(base64Body, 'base64').toString('utf-8')

      const msgSnippet = (
        await gmail.users.messages.get({ userId: 'me', id: msgs[0].id! })
      ).data.snippet;
      if (msgSnippet) {
        return msgSnippet;
      }
      await sleep(pollInterval);
    }
  }
}

/**
 * Waits for and reads a OTP-containing Beam email to a specific recipient and returns its OTP
 */
export async function retrieveOTPFromEmail({
  to,
  subject,
  timeout,
}: {
  to: string;
  subject: 'confirm your registration to beam' | 'your one time log-in to beam';
  timeout?: number;
}): Promise<string> {
  const expectedOTPLength = 6;

  const msgSnippet = await getLatestEmailBySubject({ to, subject, timeout });
  if (!msgSnippet) {
    throw new Error(`No confirmation email found in the inbox of ${to}!`);
  }

  const otpMatch = msgSnippet.match('.*code below ([0-9]{6}).*');

  if (!otpMatch) {
    throw new Error(`No OTP found in the confirmation email to ${to}!`);
  }
  expect(otpMatch[1]).toHaveLength(expectedOTPLength);

  return otpMatch[1];
}
