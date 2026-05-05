import React from 'react';
import { formatItems, formatDateIST } from '../../utils/formatters';
import { AlertCircle } from 'lucide-react';

const ConflictCard = ({ conflict, onResolve }) => {
  if (!conflict || !conflict.transactions || conflict.transactions.length < 2) return null;

  const t1 = conflict.transactions[0];
  const t2 = conflict.transactions[1];
  const isResolved = conflict.status === 'resolved';
  const isFlagged = conflict.status === 'flagged';

  const getStatusBadge = () => {
    if (isResolved) {
      return <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">Resolved</span>;
    }
    if (isFlagged) {
      return <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">Flagged</span>;
    }
    return <span className="text-xs font-bold bg-red-100 text-red-800 px-3 py-1 rounded-full">Pending</span>;
  };

  return (
    <div className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition ${
      isResolved ? 'border-green-200' : 'border-red-200'
    }`}>
      <div className={`px-4 py-3 border-b flex justify-between items-center ${
        isResolved ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
      }`}>
        <div className="flex items-center gap-3">
          <AlertCircle className={`w-5 h-5 ${isResolved ? 'text-green-600' : 'text-red-600'}`} />
          <h3 className={`font-bold ${isResolved ? 'text-green-900' : 'text-red-900'}`}>
            Duplicate Collection Detected
          </h3>
          {getStatusBadge()}
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded ${
          isResolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {conflict.month}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500 font-semibold uppercase">Beneficiary</p>
          <p className="font-bold text-lg">{conflict.beneficiaryName}</p>
          <p className="font-mono text-sm text-gray-600">{conflict.cardId}</p>
        </div>

        {isResolved && conflict.resolutionNote && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase mb-1">Resolution Note</p>
            <p className="text-sm text-blue-900">{conflict.resolutionNote}</p>
            {conflict.resolvedAt && (
              <p className="text-xs text-blue-600 mt-1">
                Resolved on {formatDateIST(conflict.resolvedAt)}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Shop A */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
            <span className="absolute -top-3 left-4 bg-gray-200 text-xs font-bold px-2 py-0.5 rounded text-gray-600">
              Record A
            </span>
            <p className="font-bold mt-2">{t1.shopId}</p>
            <p className="text-sm text-gray-600 mb-2">{formatDateIST(t1.recordedAt)}</p>
            <div className="bg-white p-2 rounded text-sm text-gray-800 border">
              {formatItems(t1.itemsDistributed)}
            </div>
            {t1.isOfflineRecord && <span className="inline-block mt-2 text-xs font-bold text-amber-600">Recorded Offline</span>}
          </div>

          {/* Shop B */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
            <span className="absolute -top-3 left-4 bg-gray-200 text-xs font-bold px-2 py-0.5 rounded text-gray-600">
              Record B
            </span>
            <p className="font-bold mt-2">{t2.shopId}</p>
            <p className="text-sm text-gray-600 mb-2">{formatDateIST(t2.recordedAt)}</p>
            <div className="bg-white p-2 rounded text-sm text-gray-800 border">
              {formatItems(t2.itemsDistributed)}
            </div>
            {t2.isOfflineRecord && <span className="inline-block mt-2 text-xs font-bold text-amber-600">Recorded Offline</span>}
          </div>
        </div>

        <button 
          onClick={() => onResolve(conflict)}
          disabled={isResolved}
          className={`w-full font-bold py-3 flex items-center justify-center rounded-lg transition ${
            isResolved 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'btn-danger hover:bg-red-700'
          }`}
        >
          {isResolved ? 'Already Resolved' : 'Review and Resolve'}
        </button>
      </div>
    </div>
  );
};

export default ConflictCard;