import React, { useState } from 'react';
import { useLocalBeneficiaries } from '../../hooks/useLocalBeneficiaries';
import { Search } from 'lucide-react';

const BeneficiarySearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const { search, results, isSearching } = useLocalBeneficiaries();
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    search(val);
  };

  const handleSelect = (b) => {
    setQuery('');
    setIsOpen(false);
    onSelect(b);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input 
          type="text" 
          value={query}
          onChange={handleInputChange}
          placeholder="Search by Card ID (e.g. RC-MH-001) or Name..."
          className="w-full text-lg py-4 pl-12 pr-4 rounded-xl border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-green-100 outline-none transition shadow-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {results.map(b => (
                <li 
                  key={b.cardId}
                  onClick={() => handleSelect(b)}
                  className="p-4 hover:bg-green-50 cursor-pointer transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{b.name}</p>
                      <p className="text-sm font-mono text-gray-500">{b.cardId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-800">
                      {b.category}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No beneficiaries found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BeneficiarySearchBar;