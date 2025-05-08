import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.e2e' });

export const vercelPassword = getSettingValue('VERCEL_PASSWORD');
export const googleApiOauth2CredentialsPath = getSettingValue(
  'GOOGLE_API_OAUTH2_CREDENTIALS_PATH',
);
export const gmailApiAccesTokenPath = getSettingValue(
  'GMAIL_API_ACCESS_TOKEN_PATH',
);
export const baseUrl = getSettingValue('BASE_URL');
export const isLocalhost = baseUrl.includes('localhost');
export const isPreview = baseUrl.includes('preview');

/** Returns the value of a given setting or throws an exception if it does not exist */
export function getSettingValue(settingName: string): string {
  const value = process.env[settingName] || '';

  if (!value) {
    throw new Error(`Setting ${settingName} is not defined!`);
  }

  return value;
}
