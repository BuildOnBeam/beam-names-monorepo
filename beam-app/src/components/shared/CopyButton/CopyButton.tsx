import { CopyIcon } from '@onbeam/icons';
import { CopyButtonProps } from './CopyButton.types';
import { useClipboard } from '@onbeam/utils';
import { cx } from '@onbeam/styled-system/css';
import { flex } from '@onbeam/styled-system/patterns';

export const CopyButton = ({
  value,
  className,
  children,
  ...props
}: CopyButtonProps) => {
  const { onCopy, hasCopied } = useClipboard(value);

  return (
    <button
      onClick={onCopy}
      type="button"
      className={cx(
        flex({
          align: 'center',
          textStyle: 'base',
          color: 'mono.300',
          transition: 'opacity',
          cursor: 'pointer',
          _hover: { opacity: 0.7 },
        }),
        className,
      )}
      {...props}
    >
      <CopyIcon width={16} height={16} />
      <span>{hasCopied ? 'copied!' : children}</span>
    </button>
  );
};
