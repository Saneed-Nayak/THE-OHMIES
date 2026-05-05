import React from 'react';
import { CheckCircle } from 'lucide-react';

const BeneficiaryCard = ({ beneficiary, blockStatus }) => {
  if (!beneficiary) return null;

  // blockStatus is expected to be an object from useDistributionCheck: { alreadyCollected, collectionDetails }

  return (
    <div className="card w-full max-w-2xl mx-auto border-t-4 border-t-primary shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{beneficiary.name}</h2>
          <p className="text-gray-500 font-mono mt-1 text-lg">{beneficiary.cardId}</p>
        </div>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-black text-xl border border-blue-200">
          {beneficiary.category}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-semibold">Location</p>
          <p className="font-medium">{beneficiary.village}, {beneficiary.district}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-semibold">Family Size</p>
          <p className="font-medium">{beneficiary.familyMembers} Members</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm text-gray-500 uppercase font-semibold mb-3">Monthly Entitlement Quota</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {['rice', 'wheat', 'sugar', 'oil'].map(item => (
             <div key={item} className="bg-green-50 p-2 rounded-lg border border-green-100">
               <p className="text-xs text-green-700 uppercase font-bold">{item}</p>
               <p className="font-black text-green-900 text-lg">
                 {beneficiary.monthlyQuota[item] || 0} {item === 'oil' ? 'L' : 'kg'}
               </p>
             </div>
          ))}
        </div>
      </div>

      {blockStatus && !blockStatus.alreadyCollected && (
        <div className="bg-green-100 text-green-800 p-4 rounded-xl flex items-center justify-center border border-green-200 shadow-inner">
          <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
          <span className="font-bold text-lg">Eligible for Collection This Month</span>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryCard;