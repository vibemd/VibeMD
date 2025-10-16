import { create } from 'zustand';

interface NavigationState {
  scrollToHeading: (headingId: string) => void;
  setScrollToHeadingHandler: (handler: (headingId: string) => void) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  scrollToHeading: () => {
    console.warn('No scroll handler set');
  },
  setScrollToHeadingHandler: (handler) => {
    set({ scrollToHeading: handler });
  },
}));
