import { CloseIcon } from '@onbeam/icons';
import { css } from '@onbeam/styled-system/css';
import { Input } from '@onbeam/ui';
import { SearchBarProps } from './SearchBar.types';

export const SearchBar = ({ value, setValue, ...props }: SearchBarProps) => (
  <Input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    rightAddon={
      value && (
        <button
          type="button"
          className={css({
            cursor: 'pointer',
            transition: 'opacity',
            _hover: { opacity: 0.6 },
          })}
          onClick={() => setValue('')}
        >
          <CloseIcon width={20} height={20} />
        </button>
      )
    }
    {...props}
  />
);
