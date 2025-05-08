'use client';

import { CloseIcon, ForwardIcon, HamburgerIcon } from '@onbeam/icons';
import { css, cx } from '@onbeam/styled-system/css';
import { flex, grid, link, text, vstack } from '@onbeam/styled-system/patterns';
import { Divider, Icon, ModalPrimitive, PoweredByBeamBanner } from '@onbeam/ui';
import { ConsentModalButton } from '../../Footer/ConsentModalButton';
import { navItems } from '../Header.data';
import Link from 'next/link';
import { tile } from '@onbeam/styled-system/recipes';
import { useBreakpoint } from '@onbeam/utils';
import { token } from '@onbeam/styled-system/tokens';
import { appMetadata } from '@/config/metadata';
import { useMobileNavigation } from './useMobileNavigation';
import { ConnectWalletButton } from '@onbeam/features';
import { useRainbowkitModal } from '@/helpers';
import { FaucetButton } from '../FaucetButton';
import { isTestnet } from '@/config/isTestnet';

export const MobileNavigation = () => {
  const isDesktop = useBreakpoint({ min: token('breakpoints.md') });
  const isOpen = useMobileNavigation((state) => state.isOpen);
  const { modalOpen: rkModalOpen } = useRainbowkitModal();

  const handleClose = () => useMobileNavigation.setState({ isOpen: false });

  return (
    <ModalPrimitive.Root
      open={isOpen && !isDesktop}
      onOpenChange={(open) => {
        if (rkModalOpen) return;
        useMobileNavigation.setState({ isOpen: open });
      }}
    >
      <ModalPrimitive.Trigger asChild>
        <button
          type="button"
          className={css({
            cursor: 'pointer',
            p: '2',

            md: {
              display: 'none',
            },
          })}
        >
          <HamburgerIcon height={20} width={20} />
        </button>
      </ModalPrimitive.Trigger>
      <ModalPrimitive.Portal>
        <ModalPrimitive.Overlay
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ModalPrimitive.Content asChild>
            <div
              className={cx(
                tile(),
                vstack({
                  top: '0',
                  minH: '[100dvh]',
                  h: 'full',
                  left: '0',
                  right: '0',
                  transform: 'none',
                  rounded: 'none',
                }),
              )}
            >
              <div
                className={cx(
                  tile(),
                  flex({
                    w: 'full',
                    p: '4',
                    gap: '4',
                    align: 'center',
                    border: 'none',
                    rounded: 'none',
                  }),
                )}
              >
                <ModalPrimitive.Title asChild>
                  <h2 className={text({ style: 'xl' })}>Menu</h2>
                </ModalPrimitive.Title>
                <div
                  className={flex({ align: 'center', gap: '2', ml: 'auto' })}
                >
                  <ConnectWalletButton size="sm" ignoreUnsupported />
                  <ModalPrimitive.Close
                    className={css({ p: '2', cursor: 'pointer' })}
                  >
                    <CloseIcon height={20} width={20} />
                  </ModalPrimitive.Close>
                </div>
              </div>
              <ModalPrimitive.Description className={css({ srOnly: true })}>
                {appMetadata.description}
              </ModalPrimitive.Description>
              <div className={vstack({ h: 'full' })}>
                <nav className={grid({ columns: 2, gap: '4', p: '4' })}>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleClose}
                      className={cx(
                        tile({ isInteractive: true }),
                        vstack({
                          gap: '2',
                          p: '4',
                        }),
                      )}
                    >
                      <Icon size={24}>{item.icon}</Icon>
                      <div className={flex({ justify: 'space-between' })}>
                        <span
                          className={link({ style: 'base', color: 'mono.100' })}
                        >
                          {item.title}
                        </span>
                        <ForwardIcon
                          height={20}
                          width={20}
                          className={css({ opacity: 0.8 })}
                        />
                      </div>
                    </Link>
                  ))}
                </nav>
                <Divider />
                {isTestnet && (
                  <span
                    className={vstack({
                      p: '4',
                      gap: '1',
                      textStyle: 'sm',
                      color: 'mono.300',
                    })}
                  >
                    On testnet, you can request{' '}
                    {process.env.NEXT_PUBLIC_BEAM_DISTRIBUTION_AMOUNT} BEAM from
                    our faucet every 24 hours for testing.
                    <FaucetButton className={css({ w: '[fit-content]' })} />
                  </span>
                )}
                <div
                  className={vstack({
                    p: '4',
                    mt: 'auto',
                    align: 'flex-start',
                    gap: '8',
                  })}
                >
                  <a
                    href="https://onbeam.com/terms"
                    rel="noopener noreferrer"
                    target="_blank"
                    className={link({
                      style: 'sm',
                      color: 'mono.300',
                    })}
                  >
                    Terms of Use
                  </a>
                  <a
                    href="https://onbeam.com/privacy-policy"
                    rel="noopener noreferrer"
                    target="_blank"
                    className={link({ style: 'sm', color: 'mono.300' })}
                  >
                    Privacy Policy
                  </a>
                  <ConsentModalButton />
                </div>
                <Divider />
                <PoweredByBeamBanner
                  className={css({
                    px: '4',
                    py: '8',
                    w: '[fit-content]',
                    flex: 'initial',
                  })}
                />
              </div>
            </div>
          </ModalPrimitive.Content>
        </ModalPrimitive.Overlay>
      </ModalPrimitive.Portal>
    </ModalPrimitive.Root>
  );
};
