import { create } from 'zustand';

interface NavigationState {
  scrollToHeading: (headingId: string) => void;
  setScrollToHeadingHandler: (handler: (headingId: string) => void) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  scrollToHeading: (headingId: string) => {
    console.log('=== NAVIGATION SERVICE DEBUG ===');
    console.log('Navigation service scrollToHeading called with:', headingId);
    console.log('Current state:', get());
    console.warn('No scroll handler set - this means TipTap editor navigation is not initialized');
    console.log('=== END NAVIGATION SERVICE DEBUG ===');
  },
  setScrollToHeadingHandler: (handler) => {
    console.log('=== NAVIGATION SERVICE SETUP ===');
    console.log('Setting scroll handler:', handler);
    set({ scrollToHeading: handler });
    console.log('Handler set successfully');
    console.log('=== END NAVIGATION SERVICE SETUP ===');
  },
}));
