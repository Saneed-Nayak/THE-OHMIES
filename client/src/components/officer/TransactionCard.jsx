import React from 'react';
import { formatDateIST, formatItems } from '../../utils/formatters';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

const TransactionCard = ({ transaction }) => {
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'synced':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4 mr-1" />, text: 'Synced' };
      case 'pending_sync':
        return { color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-4 h-4 mr-1" />, text: 'Pending' };
      case 'conflict':
        return { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-4 h-4 mr-1" />, text: 'Conflict' };
      case 'rejected':
        return { color: 'bg-gray-200 text-gray-800', icon: <XCircle className="w-4 h-4 mr-1" />, text: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: null, text: status };
    }
  };

  const statusInfo = getStatusDisplay(transaction.status);

  return (
    <div className={`card overflow-hidden hover:shadow-md transition-shadow relative border-l-4 ${
      transaction.status === 'conflict' ? 'border-l-red-500' :
      transaction.status === 'pending_sync' ? 'border-l-amber-500' :
      transaction.status === 'rejected' ? 'border-l-gray-500' : 'border-l-green-500'
    }`}>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {transaction.beneficiaryName || 'Unknown Name'}
          </h3>
          <p className="text-gray-500 font-mono text-sm">{transaction.cardId}</p>
        </div>
        <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
          {statusInfo.icon}
          {statusInfo.text}
        </div>
      </div>

      <div className="bg-gray-50 rounded p-3 mb-3 border border-gray-100">
        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Items Distributed</p>
        <p className="font-medium text-gray-900">{formatItems(transaction.itemsDistributed)}</p>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
        <span className="font-mono truncate mr-2" title={transaction.txnId}>
          ID: {transaction.txnId.substring(0, 14)}...
        </span>
        <span className="whitespace-nowrap">{formatDateIST(transaction.recordedAt)}</span>
      </div>
      
      {transaction.isOfflineRecord && (
        <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-bl font-bold">
          OFFLINE
        </span>
      )}
    </div>
  );
};

export default TransactionCard;