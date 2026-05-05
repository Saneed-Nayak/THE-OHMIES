import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FraudAlertBanner = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <div className="bg-red-600 text-white w-full rounded-xl p-4 shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between border-l-8 border-red-800">
      <div className="flex items-center mb-3 sm:mb-0">
        <div className="bg-red-800 p-2 rounded-full mr-4">
          <AlertCircle className="w-6 h-6 text-red-100 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Action Required: Fraud Alerts</h3>
          <p className="text-red-100 text-sm">
            {count} unresolved duplicate distribution {count === 1 ? 'case requires' : 'cases require'} your attention.
          </p>
        </div>
      </div>
      <Link 
        to="/supervisor/conflicts" 
        className="bg-white text-red-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
      >
        Review Now
      </Link>
    </div>
  );
};

export default FraudAlertBanner;