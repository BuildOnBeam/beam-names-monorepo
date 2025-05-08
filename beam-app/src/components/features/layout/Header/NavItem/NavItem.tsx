'use client';

import Link from 'next/link';
import { NavItemProps } from './NavItem.types';
import { usePathname } from 'next/navigation';
import { text } from '@onbeam/styled-system/patterns';

export const NavItem = ({ href, title, associatedRoutes }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || associatedRoutes?.includes(pathname);

  return (
    <Link
      href={href}
      data-active={isActive}
      className={text({
        color: 'mono.300',
        py: '1',
        px: '1.5',
        style: 'base',
        transition: 'opacity',

        '&[data-active="true"]': {
          color: 'mono.100',
        },

        _hover: {
          opacity: 0.6,
        },
      })}
    >
      {title}
    </Link>
  );
};
