import {
  SendIcon,
  ArrowUpDownIcon,
  HomeIcon,
  ActivityIcon,
} from '@onbeam/icons';
import { NavigationItem } from './Header.types';

export const navItems: NavigationItem[] = [
  {
    title: 'Wallet',
    icon: <HomeIcon />,
    href: '/',
    associatedRoutes: ['/tokens', '/nfts'],
  },
  {
    title: 'Send',
    icon: <SendIcon />,
    href: '/send',
    associatedRoutes: ['/bulk-send'],
  },
  {
    title: 'Swap',
    href: '/swap',
    icon: <ArrowUpDownIcon />,
  },
  {
    title: 'Bridge',
    icon: <ArrowUpDownIcon style={{ transform: 'rotate(90deg)' }} />,
    href: '/bridge',
  },
  {
    title: 'Buy',
    icon: <SendIcon style={{ transform: 'rotate(90deg)' }} />,
    href: '/buy',
  },
  {
    title: 'Activity',
    href: '/activity',
    icon: <ActivityIcon />,
  },
  {
    title: 'Names',
    href: '/names',
    icon: <ActivityIcon />,
  },
];
