import {
  useAccountModal,
  useConnectModal,
  useChainModal,
} from '@rainbow-me/rainbowkit';

export const useRainbowkitModal = () => {
  const { accountModalOpen } = useAccountModal();
  const { connectModalOpen } = useConnectModal();
  const { chainModalOpen } = useChainModal();

  return { modalOpen: accountModalOpen || connectModalOpen || chainModalOpen };
};
