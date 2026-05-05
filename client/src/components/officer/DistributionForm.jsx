import React from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';

const DistributionForm = ({ beneficiary, onSubmit, isSubmitting }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      rice: beneficiary.monthlyQuota.rice || 0,
      wheat: beneficiary.monthlyQuota.wheat || 0,
      sugar: beneficiary.monthlyQuota.sugar || 0,
      oil: beneficiary.monthlyQuota.oil || 0,
    }
  });

  const quota = beneficiary.monthlyQuota;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 bg-white p-6 rounded-xl border-2 border-primary shadow-xl">
      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Confirm Distribution Amounts</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {['rice', 'wheat', 'sugar', 'oil'].map(item => {
          const maxAllowed = quota[item] || 0;
          const unit = item === 'oil' ? 'Liters' : 'kg';
          
          if (maxAllowed === 0) return null; // Don't show inputs for items they don't get
          
          return (
            <div key={item} className="relative">
              <label className="block text-sm font-bold text-gray-700 uppercase mb-2 capitalize">{item} ({unit})</label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={maxAllowed}
                  className="input-field text-xl font-bold font-mono tracking-wider w-full"
                  {...register(item, { 
                    required: true,
                    min: 0,
                    max: { value: maxAllowed, message: `Max ${maxAllowed}` },
                    valueAsNumber: true
                  })}
                />
                <span className="ml-3 text-sm text-gray-500 font-medium whitespace-nowrap">
                  / {maxAllowed} {unit}
                </span>
              </div>
              {errors[item] && (
                <span className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0 font-bold">{errors[item].message}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 text-amber-800 text-sm font-medium">
        By confirming, you certify that the quantities specified above have been physically handed over to the beneficiary or authorized family member.
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary text-xl py-4 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
      >
        <CheckCircle2 className="w-6 h-6 mr-3" />
        {isSubmitting ? 'Saving...' : 'Confirm Distribution'}
      </button>
    </form>
  );
};

export default DistributionForm;