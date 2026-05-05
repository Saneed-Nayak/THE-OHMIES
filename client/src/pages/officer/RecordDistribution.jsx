import React, { useState } from 'react';
import BeneficiarySearchBar from '../../components/officer/BeneficiarySearchBar';
import BeneficiaryCard from '../../components/officer/BeneficiaryCard';
import AlreadyCollectedBlock from '../../components/officer/AlreadyCollectedBlock';
import DistributionForm from '../../components/officer/DistributionForm';
import { useDistributionCheck } from '../../hooks/useDistributionCheck';
import { useAuthContext } from '../../context/AuthContext';
import { recordDistribution } from '../../services/distributionService';
import { getCurrentMonth } from '../../utils/formatters';
import toast from 'react-hot-toast';

const RecordDistribution = () => {
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [blockStatus, setBlockStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { checkDistribution, isChecking } = useDistributionCheck();
  const { user } = useAuthContext();
  const currentMonth = getCurrentMonth();

  const handleSelectBeneficiary = async (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    const status = await checkDistribution(beneficiary.cardId, currentMonth);
    setBlockStatus(status);
  };

  const handleReset = () => {
    setSelectedBeneficiary(null);
    setBlockStatus(null);
  };

  const handleDistributionSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const payload = {
        cardId: selectedBeneficiary.cardId,
        beneficiaryName: selectedBeneficiary.name,
        shopId: user.shopId.shopId || user.shopId,
        officerId: user._id,
        month: currentMonth,
        itemsDistributed: {
          rice: data.rice || 0,
          wheat: data.wheat || 0,
          sugar: data.sugar || 0,
          oil: data.oil || 0
        }
      };

      await recordDistribution(payload);
      
      toast.success('✓ Saved locally. Will sync soon.', {
        duration: 4000,
        style: { border: '1px solid #16a34a', padding: '16px', color: '#16a34a', fontWeight: 'bold' },
        iconTheme: { primary: '#16a34a', secondary: '#fff' }
      });
      
      handleReset();
    } catch (err) {
      toast.error(err.message || 'Failed to record distribution. Duplicate?');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Record Distribution</h1>
        <p className="text-gray-500 font-medium">Search for a family to record their {currentMonth} rations.</p>
      </div>

      {!selectedBeneficiary ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
          <BeneficiarySearchBar onSelect={handleSelectBeneficiary} />
        </div>
      ) : (
        <div className="animate-fade-in relative transition-all">
          {/* Verify step: Block if already collected */}
          {blockStatus?.alreadyCollected && (
            <AlreadyCollectedBlock details={blockStatus.collectionDetails} onBack={handleReset} />
          )}

          {/* Show Card */}
          <div className="mb-6 flex justify-between items-center">
            <button onClick={handleReset} className="text-gray-500 hover:text-gray-900 font-bold text-sm bg-white px-4 py-2 rounded-lg border shadow-sm">
              ← Back to Search
            </button>
          </div>

          <BeneficiaryCard 
            beneficiary={selectedBeneficiary} 
            blockStatus={blockStatus}
          />
          
          {/* Distribute step */}
          {blockStatus && !blockStatus.alreadyCollected && !isChecking && (
            <DistributionForm 
              beneficiary={selectedBeneficiary} 
              onSubmit={handleDistributionSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {isChecking && (
            <div className="mt-8 text-center text-gray-500 font-bold p-8 bg-white rounded-xl shadow-sm border border-gray-200">
              Checking records...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordDistribution;