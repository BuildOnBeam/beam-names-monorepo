if (!process.env.NEXT_PUBLIC_URL)
  throw new Error('NEXT_PUBLIC_URL is not defined');

export const appMetadata = {
  title: 'Beam App: Essential tools for the Beam chain',
  name: 'Beam App',
  description:
    'The Beam App provides a comprehensive suite of utilities to streamline your experience on the Beam chain.',
  icon: '/favicon.ico',
  url: process.env.NEXT_PUBLIC_URL,
} as const;
