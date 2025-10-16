import { useRef, useState, useLayoutEffect } from 'react';

export interface ToolbarButton {
  id: string;
  component: React.ReactNode;
  width?: number;
  priority?: number; // Higher priority = more likely to stay visible
}

interface UseResponsiveToolbarReturn {
  toolbarRef: React.RefObject<HTMLDivElement>;
  visibleButtons: ToolbarButton[];
  overflowButtons: ToolbarButton[];
}

export const useResponsiveToolbar = (buttons: ToolbarButton[]): UseResponsiveToolbarReturn => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [visibleButtons, setVisibleButtons] = useState<ToolbarButton[]>([]);
  const [overflowButtons, setOverflowButtons] = useState<ToolbarButton[]>([]);

  useLayoutEffect(() => {
    const updateToolbar = () => {
      const toolbar = toolbarRef.current;
      if (!toolbar) return;

      const toolbarWidth = toolbar.offsetWidth;
      const separatorWidth = 8; // Width of separators
      const moreButtonWidth = 60; // Reserve space for "More" button
      const padding = 16; // Toolbar padding
      const availableWidth = toolbarWidth - padding - moreButtonWidth;
      
      let totalWidth = 0;
      const newVisibleButtons: ToolbarButton[] = [];
      const newOverflowButtons: ToolbarButton[] = [];

      // Sort buttons by priority (higher priority first)
      const sortedButtons = [...buttons].sort((a, b) => (b.priority || 0) - (a.priority || 0));

      sortedButtons.forEach((button, index) => {
        const buttonWidth = button.width || 40; // Default button width
        const separatorSpace = index > 0 ? separatorWidth : 0;
        
        if (totalWidth + buttonWidth + separatorSpace <= availableWidth) {
          newVisibleButtons.push(button);
          totalWidth += buttonWidth + separatorSpace;
        } else {
          newOverflowButtons.push(button);
        }
      });

      setVisibleButtons(newVisibleButtons);
      setOverflowButtons(newOverflowButtons);
    };

    // Initial calculation
    updateToolbar();

    // Add resize listener
    window.addEventListener('resize', updateToolbar);

    // Cleanup
    return () => window.removeEventListener('resize', updateToolbar);
  }, [buttons]);

  return { toolbarRef, visibleButtons, overflowButtons };
};
