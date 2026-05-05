import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { formatDateIST, formatItems } from '../../utils/formatters';

const AlreadyCollectedBlock = ({ details, onBack }) => {
  return (
    <div className="fixed inset-0 z-50 bg-red-600 text-white flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <AlertTriangle className="w-24 h-24 mb-6 animate-pulse text-white opacity-90" />
      
      <h1 className="text-4xl font-black mb-4 tracking-tight">STOP!</h1>
      <h2 className="text-2xl font-bold mb-8">This family already collected their ration this month.</h2>

      <div className="bg-red-700 bg-opacity-50 p-6 rounded-xl text-left w-full max-w-lg mb-8 backdrop-blur-sm border border-red-500 shadow-2xl">
        <div className="space-y-4">
          <div>
            <p className="text-red-200 text-sm uppercase font-bold tracking-wider">Date & Time Collected</p>
            <p className="text-xl font-mono">{formatDateIST(details.recordedAt)}</p>
          </div>
          <div>
            <p className="text-red-200 text-sm uppercase font-bold tracking-wider">Items Given</p>
            <p className="text-xl font-semibold">{formatItems(details.itemsDistributed)}</p>
          </div>
          <div className="pt-4 border-t border-red-500">
            <p className="text-red-200 text-sm uppercase font-bold tracking-wider">Transaction ID</p>
            <p className="text-md font-mono mt-1 opacity-80">{details.txnId}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center px-8 py-4 bg-white text-red-700 font-bold rounded-full text-xl hover:bg-gray-100 transition shadow-xl"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Go Back to Search
      </button>
    </div>
  );
};

export default AlreadyCollectedBlock;