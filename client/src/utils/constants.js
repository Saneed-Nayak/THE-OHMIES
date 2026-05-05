export const CATEGORIES = ['APL', 'BPL', 'AAY'];

export const STATUS = {
  PENDING: 'pending_sync',
  SYNCED: 'synced',
  CONFLICT: 'conflict',
  REJECTED: 'rejected'
};

export const ITEMS = ['rice', 'wheat', 'sugar', 'oil'];

export const ROLES = ['officer', 'supervisor', 'admin'];

export const SYNC_BATCH_SIZE = 50;
export const SYNC_INTERVAL_MS = 300000; // 5 minutes
export const RETRY_LIMIT = 5;