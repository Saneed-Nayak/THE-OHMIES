import React from 'react';

const MonthlyProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;
  
  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="font-bold text-gray-700">Monthly Target</h4>
          <p className="text-sm text-gray-500">Families served this month</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-primary">{current}</span>
          <span className="text-gray-400 font-medium mx-1">/</span>
          <span className="font-medium text-gray-600">{total}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-3 mb-1 overflow-hidden mt-2">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out relative" 
          style={{ width: `${percentage}%` }}
        >
          {percentage > 5 && (
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-right font-bold">{percentage}% Complete</p>
    </div>
  );
};

export default MonthlyProgressBar;