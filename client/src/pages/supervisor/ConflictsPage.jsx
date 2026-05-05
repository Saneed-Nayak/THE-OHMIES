import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ConflictCard from '../../components/supervisor/ConflictCard';
import ConflictResolutionModal from '../../components/supervisor/ConflictResolutionModal';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

const ConflictsPage = () => {
  const [conflicts, setConflicts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [showResolved, setShowResolved] = useState(false);

  useEffect(() => {
    fetchConflicts();
  }, [showResolved]);

  const fetchConflicts = async () => {
    try {
      const params = showResolved ? {} : { status: 'pending' };
      const res = await api.get('/conflicts', { params });
      setConflicts(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load conflicts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (conflict) => {
    setSelectedConflict(conflict);
  };

  const handleConfirmResolution = async (resolutionData) => {
    try {
      await api.put(`/conflicts/${resolutionData.conflictId}/resolve`, {
        validTransactionId: resolutionData.validTransactionId,
        fraudTransactionId: resolutionData.fraudTransactionId,
        resolutionNote: resolutionData.resolutionNote
      });
      
      toast.success('Conflict resolved successfully');
      setSelectedConflict(null);
      fetchConflicts(); // Refresh the list
    } catch (err) {
      toast.error('Failed to resolve conflict');
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setSelectedConflict(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-bold">Loading conflicts...</div>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-black text-gray-900">Conflict Resolution</h1>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              showResolved 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {showResolved ? 'Show Pending Only' : 'Show All Conflicts'}
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading conflicts...</div>
        ) : conflicts.length === 0 ? (
          <div className="text-center p-12 bg-green-50 rounded-xl border border-green-200">
            <p className="text-xl font-bold text-green-800">
              {showResolved ? 'No conflicts found' : 'No pending conflicts'}
            </p>
            <p className="text-gray-600 mt-2">All distributions are clean</p>
          </div>
        ) : (
          <div className="space-y-6">
            {conflicts.map((conflict) => (
              <ConflictCard 
                key={conflict._id} 
                conflict={conflict} 
                onResolve={handleResolve}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedConflict && (
        <ConflictResolutionModal
          conflict={selectedConflict}
          onClose={handleCloseModal}
          onResolve={handleConfirmResolution}
        />
      )}
    </>
  );
};

export default ConflictsPage;
