import { cx } from '@onbeam/styled-system/css';
import { SectionHeaderProps } from './SectionHeader.types';
import { flex, text, vstack } from '@onbeam/styled-system/patterns';
import { IconButton } from '@onbeam/ui';
import Link from 'next/link';
import { BackIcon } from '@onbeam/icons';

export const SectionHeader = ({
  title,
  as: As = 'h1',
  description,
  backHref,
  className,
  children,
}: SectionHeaderProps) => (
  <div
    className={cx(vstack({ gap: '3', mb: '5', md: { mb: '6' } }), className)}
  >
    <div
      className={flex({
        gap: '3',
        align: 'center',
      })}
    >
      {backHref && (
        <IconButton as={Link} href={backHref} aria-label="Go back">
          <BackIcon />
        </IconButton>
      )}
      <As
        className={text({
          style: 'xl',
          mr: 'auto',
          md: { textStyle: 'header' },
        })}
      >
        {title}
      </As>
      {children}
    </div>
    {description && (
      <p className={text({ style: 'sm', color: 'mono.300' })}>{description}</p>
    )}
  </div>
);
