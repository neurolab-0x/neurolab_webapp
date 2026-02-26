import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PortalView = 'DOCTOR' | 'CLINIC';
type Theme = 'light' | 'dark';

interface PortalState {
    activeView: PortalView;
    theme: Theme;
    setActiveView: (view: PortalView) => void;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const usePortalStore = create<PortalState>()(
    persist(
        (set) => ({
            activeView: 'CLINIC', // Default to Clinic view
            theme: 'dark', // Platform defaults to Deep Space dark mode

            setActiveView: (view) => set({ activeView: view }),

            setTheme: (theme) => {
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                set({ theme });
            },

            toggleTheme: () => set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { theme: newTheme };
            }),
        }),
        {
            name: 'neurai-portal-storage', // name of the item in the storage (must be unique)
        }
    )
);
