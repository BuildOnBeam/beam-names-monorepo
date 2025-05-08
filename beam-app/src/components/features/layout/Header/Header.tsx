import { FaucetButton } from './FaucetButton';
import { BeamNetworkIcon } from '@onbeam/icons';
import { flex } from '@onbeam/styled-system/patterns';
import { navItems } from './Header.data';
import { NavItem } from './NavItem';
import { css, cx } from '@onbeam/styled-system/css';
import { MobileNavigation } from './MobileNavigation';
import { tile } from '@onbeam/styled-system/recipes';
import Link from 'next/link';
import { ConnectWalletButton } from '@onbeam/features';

export const Header = () => (
  <header
    className={cx(
      tile(),
      flex({
        w: 'full',
        p: '4',
        gap: '4',
        align: 'center',
        rounded: 'none',

        md: {
          rounded: 'md',
        },
      }),
    )}
  >
    <Link href="/">
      <BeamNetworkIcon
        className={css({ transition: 'opacity', _hover: { opacity: 0.7 } })}
      />
      <span className={css({ srOnly: true })}>Wallet</span>
    </Link>
    <nav
      className={flex({
        gap: '2',
        align: 'center',
        display: 'none',

        md: {
          display: 'flex',
        },
      })}
    >
      {navItems.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
    <div className={flex({ ml: 'auto', gap: '2', align: 'center' })}>
      <FaucetButton
        className={css({
          mdDown: { display: 'none' },
        })}
      />
      <ConnectWalletButton size="sm" ignoreUnsupported />
      <MobileNavigation />
    </div>
  </header>
);
