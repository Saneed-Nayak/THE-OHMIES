import { db } from '../db/localDB';
import { generateTxnId } from '../utils/generateTxnId';
import { getOrGenerateDeviceId } from '../utils/generateDeviceId';
import { syncService } from './syncService';

export const recordDistribution = async (data) => {
  const { cardId, beneficiaryName, shopId, officerId, month, itemsDistributed } = data;

  const txnId = await generateTxnId(cardId, shopId, month);

  // RULE 1: Offline duplicate check
  const existingTxn = await db.transactions.get(txnId);
  if (existingTxn) {
    throw new Error('Duplicate transaction detected linearly.');
  }

  const deviceId = await getOrGenerateDeviceId();

  const transaction = {
    txnId,
    cardId,
    beneficiaryName,
    shopId,
    officerId,
    month,
    itemsDistributed,
    status: 'pending_sync',
    recordedAt: new Date(),
    deviceId,
    isOfflineRecord: !navigator.onLine
  };

  await db.transaction('rw', db.transactions, db.pendingSync, async () => {
    await db.transactions.add(transaction);
    await db.pendingSync.add({
      txnId,
      retryCount: 0,
      lastAttemptAt: null,
      createdAt: new Date()
    });
  });

  if (navigator.onLine) {
    // Trigger async sync without awaiting to not block UI
    syncService.runSync();
  }

  return transaction;
};