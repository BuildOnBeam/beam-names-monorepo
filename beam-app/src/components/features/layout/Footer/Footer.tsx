import { flex, link } from '@onbeam/styled-system/patterns';
import { ConsentModalButton } from './ConsentModalButton';
import { css } from '@onbeam/styled-system/css';
import { PoweredByBeamBanner } from '@onbeam/ui';

export const Footer = () => (
  <footer
    className={flex({
      w: 'full',
      gap: '6',
      display: 'none',

      md: { display: 'flex' },
    })}
  >
    <PoweredByBeamBanner className={css({ maxW: '[23.8rem]' })} />
    <a
      href="https://onbeam.com/terms"
      rel="noopener noreferrer"
      target="_blank"
      className={link({ style: 'sm', color: 'mono.300', ml: 'auto' })}
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
  </footer>
);
