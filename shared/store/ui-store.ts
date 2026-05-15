import { create } from 'zustand';

type UiState = {
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isAiDrawerOpen: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  
  toggleAiDrawer: () => void;
  setAiDrawerOpen: (open: boolean) => void;
  
  // Navigation event resets
  closeAllDrawers: () => void;
  resetSessionState: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  isCommandPaletteOpen: false,
  isAiDrawerOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),

  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  toggleAiDrawer: () => set((state) => ({ isAiDrawerOpen: !state.isAiDrawerOpen })),
  setAiDrawerOpen: (open) => set({ isAiDrawerOpen: open }),

  closeAllDrawers: () => set({ 
    isMobileDrawerOpen: false, 
    isCommandPaletteOpen: false, 
    isAiDrawerOpen: false 
  }),
  
  resetSessionState: () => set({ 
    isSidebarCollapsed: false,
    isMobileDrawerOpen: false, 
    isCommandPaletteOpen: false, 
    isAiDrawerOpen: false 
  }),
}));
