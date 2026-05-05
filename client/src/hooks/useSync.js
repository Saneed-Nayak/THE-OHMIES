import { useState, useEffect, useCallback } from 'react';
import { db } from '../db/localDB';
import { syncService } from '../services/syncService';
import { useOnlineStatus } from './useOnlineStatus';
import { SYNC_INTERVAL_MS } from '../utils/constants';

export const useSync = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isOnline } = useOnlineStatus();

  const loadStats = useCallback(async () => {
    const pending = await db.pendingSync.count();
    const conflicts = await db.transactions.where('status').equals('conflict').count();
    const lastSyncConfig = await db.appConfig.get('lastSyncAt');
    
    setPendingCount(pending);
    setConflictCount(conflicts);
    if (lastSyncConfig) {
      setLastSyncedAt(new Date(lastSyncConfig.value));
    }
  }, []);

  const triggerSync = useCallback(async () => {
    if (!isOnline || syncService.isSyncing) return;
    setIsSyncing(true);
    await syncService.runSync();
    await loadStats();
    setIsSyncing(false);
  }, [isOnline, loadStats]);

  useEffect(() => {
    loadStats();
    
    let interval;
    if (isOnline) {
      triggerSync(); // Initial sync on mount if online
      interval = setInterval(triggerSync, SYNC_INTERVAL_MS);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, triggerSync, loadStats]);

  return { pendingCount, conflictCount, lastSyncedAt, isSyncing, triggerSync };
};