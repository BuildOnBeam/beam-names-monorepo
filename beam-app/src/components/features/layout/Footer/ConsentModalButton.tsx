'use client';

import { link } from '@onbeam/styled-system/patterns';
import { useCookieConsentStore } from '@onbeam/utils';

export const ConsentModalButton = () => {
  const open = useCookieConsentStore((store) => store.openConsentModal);

  return (
    <button
      className={link({ style: 'sm', color: 'mono.300' })}
      onClick={open}
      type="button"
    >
      Cookies
    </button>
  );
};
