import { useState, useCallback } from 'react';
import { db } from '../db/localDB';
import { syncService } from '../services/syncService';

export const useDistributionCheck = () => {
    const [isChecking, setIsChecking] = useState(false);

    const checkDistribution = useCallback(async (cardId, month) => {
        setIsChecking(true);
        try {
            const existingTxn = await db.transactions
                .filter(t => t.cardId === cardId && t.month === month && t.status !== 'rejected')
                .first();

            return {
                alreadyCollected: !!existingTxn,
                collectionDetails: existingTxn || null
            };
        } catch (error) {
            console.error('Check distribution error:', error);
            return { alreadyCollected: false, collectionDetails: null };
        } finally {
            setIsChecking(false);
        }
    }, []);

    return { checkDistribution, isChecking };
};