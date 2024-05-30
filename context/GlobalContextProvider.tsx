'use client';
import { type Dispatch, createContext, useContext, useMemo, useState, type SetStateAction } from 'react';

// Create context
type GlobalStore = {
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
};

const GlobalContext = createContext<GlobalStore>({
  unreadCount: 0,
  setUnreadCount: () => 0,
});

// Create a provider
export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const contextValue = useMemo(() => ({ unreadCount, setUnreadCount }), [unreadCount, setUnreadCount]);

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

// Create a custom hook to access context
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error('useGlobalContext was used outside of the ProfileProvider');
  return context;
}
