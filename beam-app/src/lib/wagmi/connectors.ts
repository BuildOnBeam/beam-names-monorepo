import { appMetadata } from '@/config/metadata';
import { getConnectors } from '@onbeam/utils';
import { WalletConnectParameters } from 'wagmi/connectors';

const walletMetadata: WalletConnectParameters['metadata'] = {
  name: appMetadata.name,
  description: appMetadata.description,
  url: appMetadata.url,
  icons: [appMetadata.icon],
};

export const connectors = getConnectors({
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  appName: walletMetadata.name,
  appDescription: walletMetadata.description,
  appUrl: walletMetadata.url,
  appIcon: walletMetadata.icons[0],
  walletConnectParameters: { metadata: walletMetadata },
});
