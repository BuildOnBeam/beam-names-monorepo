import { Metadata, Viewport } from 'next/types';
import { PropsWithChildren } from 'react';
import { Toaster } from '@onbeam/ui';
import { vstack } from '@onbeam/styled-system/patterns';
import { Footer, Header, Main, Providers } from '@/components';
import { customScrollbar } from '@onbeam/styled-system/recipes';
import { GoogleTagManager } from '@/helpers/GoogleTagManager';
import { CookieConsent } from '@onbeam/features';
import { appMetadata } from '@/config/metadata';
import { cookieToInitialState } from 'wagmi';
import { createWagmiConfig } from '@/lib/wagmi/createWagmiConfig';
import { headers } from 'next/headers';
import { css, cx } from '@onbeam/styled-system/css';
import { getConversionRates } from '@/actions';

import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';

export const metadata: Metadata = {
  title: appMetadata.title,
  description: appMetadata.description,
  metadataBase: new URL(appMetadata.url),
  openGraph: {
    type: 'website',
    siteName: appMetadata.name,
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 675,
      },
    ],
  },
  icons: {
    icon: './favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const RootLayout = async ({ children }: PropsWithChildren) => {
  // Wagmi initial state needs to be hydrated on the server
  const initialState = cookieToInitialState(
    createWagmiConfig(),
    (await headers()).get('cookie'),
  );

  const conversionRates = await getConversionRates();

  return (
    <html lang="en">
      <body
        className={cx(
          customScrollbar(),
          css({
            bg: '[#0F0F0F]',
          }),
        )}
      >
        <Providers
          conversionRates={conversionRates}
          hydrate={{ wagmi: { initialState } }}
        >
          <div
            className={vstack({
              minH: '[100dvh]',
              maxW: '[calc(51.5rem + token(spacing.10))]',
              mx: 'auto',

              md: {
                p: '5',
              },
            })}
          >
            <Header />
            <Main>{children}</Main>
            <Footer />
            <Toaster />
            <CookieConsent
              consentDomain={
                process.env.NODE_ENV === 'development'
                  ? 'localhost'
                  : '.onbeam.com'
              }
            />
          </div>
        </Providers>
      </body>
      <GoogleTagManager />
    </html>
  );
};

export default RootLayout;
