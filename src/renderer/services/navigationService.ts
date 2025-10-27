import { create } from 'zustand';

interface NavigationState {
  scrollToHeading: (headingId: string) => void;
  hasScrollHandler: boolean;
  setScrollToHeadingHandler: (handler: (headingId: string) => void) => void;
  clearScrollToHeadingHandler: () => void;
}

const defaultScrollHandler = () => {
  // No-op until handler is set by TipTap editor
};

export const useNavigationStore = create<NavigationState>((set) => ({
  scrollToHeading: defaultScrollHandler,
  hasScrollHandler: false,
  setScrollToHeadingHandler: (handler) => {
    set({
      scrollToHeading: handler,
      hasScrollHandler: true,
    });
  },
  clearScrollToHeadingHandler: () => {
    set({
      scrollToHeading: defaultScrollHandler,
      hasScrollHandler: false,
    });
  },
}));
