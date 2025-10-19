import { create } from 'zustand';

interface NavigationState {
  scrollToHeading: (headingId: string) => void;
  setScrollToHeadingHandler: (handler: (headingId: string) => void) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  scrollToHeading: () => {
    // No-op until handler is set by TipTap editor
  },
  setScrollToHeadingHandler: (handler) => {
    set({ scrollToHeading: handler });
  },
}));
