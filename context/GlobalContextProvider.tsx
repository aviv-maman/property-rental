'use client';
import getUnreadMessageCount from '@/app/actions/getUnreadMessageCount';
import { useSession } from 'next-auth/react';
import { type Dispatch, createContext, useContext, useMemo, useState, type SetStateAction, useEffect } from 'react';

type GlobalStore = {
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
};

const GlobalContext = createContext<GlobalStore>({
  unreadCount: 0,
  setUnreadCount: () => 0,
});

export function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const contextValue = useMemo(() => ({ unreadCount, setUnreadCount }), [unreadCount, setUnreadCount]);

  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user) {
      getUnreadMessageCount().then((res) => {
        if (res.count) setUnreadCount(res.count);
      });
    }
  }, [session]);

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

// Create a custom hook to access context
export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) throw new Error('useGlobalContext was used outside of the ProfileProvider');
  return context;
}
