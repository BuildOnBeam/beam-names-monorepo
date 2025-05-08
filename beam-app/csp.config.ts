const connectSrc = [
  "'self'",
  'blob:',
  'https://*.onbeam.com',
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.org',
  'https://*.coingecko.com',
  'http://134.209.137.164:8000/subgraphs/name/beamswap',
  'https://*.g.alchemy.com',
  'https://glacier-api.avax.network',
  'https://*.layerzero-api.com',
  'https://*.sentry.io',
].join(' ');

const scriptSrc = [
  "'self'",
  "'unsafe-eval'",
  "'unsafe-inline'",
  'blob:',
  'https://www.googletagmanager.com',
].join(' ');

const imageSrc = [
  "'self'",
  'blob:',
  'data:',
  'https://*.walletconnect.com',
  'https://media.sphere.market',
  'https://s3.amazonaws.com',
  'https://s3.eu-central-1.amazonaws.com',
].join(' ');

const frameSrc = [
  'https://*.transak.com/',
  'https://verify.walletconnect.org',
].join(' ');

const fontSrc = ["'self'", 'https://fonts.gstatic.com'].join(' ');

export const cspPolicies = `
  default-src 'self';
  script-src ${scriptSrc};
  style-src 'self' 'unsafe-inline';
  connect-src ${connectSrc};
  img-src ${imageSrc};
  font-src ${fontSrc};
  frame-src ${frameSrc};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  `.replace(/\n/g, '');

// TODO: Add back when the swap subgraphs endpoint gets SSL
// upgrade-insecure-requests;
