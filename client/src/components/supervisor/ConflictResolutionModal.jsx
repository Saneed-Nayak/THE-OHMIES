import React, { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { formatItems, formatDateIST } from '../../utils/formatters';

const ConflictResolutionModal = ({ conflict, onClose, onResolve }) => {
  const [selectedValid, setSelectedValid] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!conflict || !conflict.transactions || conflict.transactions.length < 2) return null;

  const t1 = conflict.transactions[0];
  const t2 = conflict.transactions[1];

  const handleSubmit = async () => {
    if (!selectedValid) {
      alert('Please select which transaction is valid');
      return;
    }

    setIsSubmitting(true);
    const validTxn = selectedValid === 'A' ? t1 : t2;
    const fraudTxn = selectedValid === 'A' ? t2 : t1;

    await onResolve({
      conflictId: conflict.conflictId,
      validTransactionId: validTxn._id,
      fraudTransactionId: fraudTxn._id,
      resolutionNote
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-red-600 text-white px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Resolve Conflict</h2>
          <button onClick={onClose} className="hover:bg-red-700 p-2 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Beneficiary Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 font-semibold uppercase">Beneficiary</p>
            <p className="font-bold text-xl">{conflict.beneficiaryName}</p>
            <p className="font-mono text-sm text-gray-600">{conflict.cardId}</p>
            <p className="text-sm text-gray-700 mt-1">Month: <span className="font-bold">{conflict.month}</span></p>
          </div>

          {/* Transaction Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Transaction A */}
            <div 
              onClick={() => setSelectedValid('A')}
              className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                selectedValid === 'A' 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-300 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Transaction A
                </span>
                {selectedValid === 'A' && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Shop</p>
                  <p className="font-bold text-lg">{t1.shopId}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Recorded At</p>
                  <p className="text-sm font-medium">{formatDateIST(t1.recordedAt)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Items Distributed</p>
                  <div className="bg-white p-3 rounded border text-sm">
                    {formatItems(t1.itemsDistributed)}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Officer</p>
                  <p className="text-sm">{t1.officerId || 'N/A'}</p>
                </div>

                {t1.isOfflineRecord && (
                  <span className="inline-block text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    Recorded Offline
                  </span>
                )}
              </div>
            </div>

            {/* Transaction B */}
            <div 
              onClick={() => setSelectedValid('B')}
              className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                selectedValid === 'B' 
                  ? 'border-green-500 bg-green-50 shadow-lg' 
                  : 'border-gray-300 hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Transaction B
                </span>
                {selectedValid === 'B' && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Shop</p>
                  <p className="font-bold text-lg">{t2.shopId}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Recorded At</p>
                  <p className="text-sm font-medium">{formatDateIST(t2.recordedAt)}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Items Distributed</p>
                  <div className="bg-white p-3 rounded border text-sm">
                    {formatItems(t2.itemsDistributed)}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Officer</p>
                  <p className="text-sm">{t2.officerId || 'N/A'}</p>
                </div>

                {t2.isOfflineRecord && (
                  <span className="inline-block text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    Recorded Offline
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Resolution Note */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Resolution Notes (Optional)
            </label>
            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Add any notes about this resolution..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedValid || isSubmitting}
              className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
                !selectedValid || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Resolving...' : 'Confirm Resolution'}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-lg font-bold border-2 border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Instructions:</strong> Select the valid transaction by clicking on it. 
              The selected transaction will be marked as valid, and the other will be marked as fraudulent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictResolutionModal;
