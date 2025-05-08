import { InfoIcon } from '@onbeam/icons';
import { EmptyResultsProps } from './EmptyResults.types';
import { Button } from '@onbeam/ui';
import { css, cx } from '@onbeam/styled-system/css';
import { text, vstack } from '@onbeam/styled-system/patterns';

export const EmptyResults = ({
  noun = 'items',
  className,
  children,
  onClear,
}: EmptyResultsProps) => (
  <div
    className={cx(
      vstack({ gap: '2', align: 'center', my: 'auto', color: 'mono.300' }),
      className,
    )}
  >
    <InfoIcon />
    <p
      className={text({
        style: 'base',
        textAlign: 'center',
      })}
    >
      {children || (
        <>
          No {noun} match your search. <br />
          Try a different keyword.
        </>
      )}
    </p>
    {onClear && (
      <Button className={css({ mt: '2' })} onClick={onClear} size="sm">
        clear search
      </Button>
    )}
  </div>
);
