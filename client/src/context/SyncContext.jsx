import React, { createContext, useContext } from 'react';
import { useSync as useSyncHook } from '../hooks/useSync';

const SyncContext = createContext(null);

export const SyncProvider = ({ children }) => {
  const sync = useSyncHook();
  return (
    <SyncContext.Provider value={sync}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = () => useContext(SyncContext);