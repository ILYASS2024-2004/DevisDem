import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            // État d'authentification
            isAuthenticated: false,
            user: null,
            token: null,

            // État de l'interface
            sidebarOpen: true,
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,

            // Actions d'authentification
            setAuth: (user, token) => {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                set({ isAuthenticated: true, user, token });
            },

            clearAuth: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                set({ isAuthenticated: false, user: null, token: null });
            },

            // Actions de l'interface
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

            // État des clients
            clients: [],
            selectedClient: null,
            clientLoading: false,
            clientError: null,

            // Actions des clients
            setClients: (clients) => set({ clients }),
            setSelectedClient: (client) => set({ selectedClient: client }),
            setClientLoading: (loading) => set({ clientLoading: loading }),
            setClientError: (error) => set({ clientError: error }),

            // État des devis
            quotes: [],
            selectedQuote: null,
            quoteLoading: false,
            quoteError: null,

            // Actions des devis
            setQuotes: (quotes) => set({ quotes }),
            setSelectedQuote: (quote) => set({ selectedQuote: quote }),
            setQuoteLoading: (loading) => set({ quoteLoading: loading }),
            setQuoteError: (error) => set({ quoteError: error }),

            // État des notifications
            notifications: [],
            unreadNotifications: 0,

            // Actions des notifications
            addNotification: (notification) =>
                set((state) => ({
                    notifications: [notification, ...state.notifications],
                    unreadNotifications: state.unreadNotifications + 1
                })),

            markNotificationAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, read: true } : n
                    ),
                    unreadNotifications: Math.max(0, state.unreadNotifications - 1)
                })),

            clearNotifications: () => set({ notifications: [], unreadNotifications: 0 })
        }),
        {
            name: 'app-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                token: state.token,
                darkMode: state.darkMode
            })
        }
    )
);

export default useStore; 