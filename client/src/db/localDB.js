import Dexie from 'dexie';

export const db = new Dexie('RationTrackDB');

db.version(1).stores({
  beneficiaries: 'cardId, name, category, assignedShopId, isActive, lastSyncedAt',
  transactions: 'txnId, cardId, shopId, month, status, recordedAt, syncedAt, isOfflineRecord',
  pendingSync: '++id, txnId, retryCount, lastAttemptAt, createdAt',
  syncLog: '++id, type, status, timestamp',
  appConfig: 'key, value'
});