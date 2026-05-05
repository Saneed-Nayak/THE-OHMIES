import api from './api';
import { db } from '../db/localDB';
import { SYNC_BATCH_SIZE } from '../utils/constants';

class SyncService {
  constructor() {
    this.isSyncing = false;
  }

  async runSync() {
    if (this.isSyncing || !navigator.onLine) return;

    try {
      // 1. check health
      await api.get('/health');
    } catch {
      return; // Offline or server down
    }

    this.isSyncing = true;
    
    try {
      const config = await db.appConfig.get('shopId');
      if (!config) {
        this.isSyncing = false;
        return; 
      }
      const shopId = config.value;

      // 2. Pull updates
      await this.pullUpdates(shopId);

      // 3. Push pending
      await this.pushPending(shopId);

      // 5. Update config
      await db.appConfig.put({ key: 'lastSyncAt', value: new Date().toISOString() });
      
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  async pullUpdates(shopId) {
    try {
      const res = await api.get(`/sync/pull/${shopId}`);
      if (res.data?.success) {
        const { beneficiaries } = res.data.data;
        if (beneficiaries && beneficiaries.length > 0) {
          // Add or update beneficiaries in localDB
          await db.beneficiaries.bulkPut(beneficiaries);
        }
      }
    } catch (error) {
      console.error('Pull updates failed:', error);
    }
  }

  async pushPending(shopId) {
    try {
      const pendingRecords = await db.pendingSync.limit(SYNC_BATCH_SIZE).toArray();
      if (pendingRecords.length === 0) return;

      const txnIds = pendingRecords.map(p => p.txnId);
      const transactions = await db.transactions.where('txnId').anyOf(txnIds).toArray();

      const res = await api.post('/sync/push', {
        shopId,
        transactions
      });

      if (res.data?.success) {
        const { results } = res.data;
        
        for (const result of results) {
          if (result.result === 'success') {
            await db.transactions.update(result.txnId, { status: 'synced', syncedAt: new Date() });
            await db.pendingSync.where('txnId').equals(result.txnId).delete();
          } else if (result.result === 'duplicate') {
            await db.transactions.update(result.txnId, { status: 'rejected' });
            await db.pendingSync.where('txnId').equals(result.txnId).delete();
          } else if (result.result === 'conflict') {
            await db.transactions.update(result.txnId, { status: 'conflict', conflictId: result.conflictId });
            await db.pendingSync.where('txnId').equals(result.txnId).delete();
          } else {
             // Error case
             const pending = await db.pendingSync.where('txnId').equals(result.txnId).first();
             if (pending) {
               pending.retryCount += 1;
               pending.lastAttemptAt = new Date();
               if (pending.retryCount > 5) {
                 await db.transactions.update(result.txnId, { status: 'rejected', notes: 'Max retries exceeded' });
                 await db.pendingSync.where('txnId').equals(result.txnId).delete();
               } else {
                 await db.pendingSync.put(pending);
               }
             }
          }
        }
      }
    } catch (error) {
      console.error('Push pending failed:', error);
    }
  }
}

export const syncService = new SyncService();