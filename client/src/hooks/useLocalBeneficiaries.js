import { useState } from 'react';
import { db } from '../db/localDB';

export const useLocalBeneficiaries = () => {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async (query) => {
    setIsSearching(true);
    if (!query || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    try {
      const lowerQuery = query.toLowerCase();
      // Search by cardId or name in IndexedDB
      const beneficiaries = await db.beneficiaries.filter(b => 
        b.cardId.toLowerCase().includes(lowerQuery) || 
        b.name.toLowerCase().includes(lowerQuery)
      ).toArray();

      setResults(beneficiaries);
    } catch (error) {
      console.error('Local search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return { results, isSearching, search };
};