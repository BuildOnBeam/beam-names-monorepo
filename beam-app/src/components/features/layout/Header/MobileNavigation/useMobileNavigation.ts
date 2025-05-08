import { create } from 'zustand';

type MobileNavigationState = {
  isOpen: boolean;
};

export const useMobileNavigation = create<MobileNavigationState>(() => ({
  isOpen: false,
}));
