import React, { useState, useEffect } from 'react';
import { Server, Database, ShieldAlert, CheckCircle, Users } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get('/shops');
        setShops(res.data.data);
      } catch (err) {
        toast.error('Failed to load live infrastructure data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-6">System Administration</h1>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-6 border-b pb-2">Infrastructure Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="p-6 border rounded-xl bg-gray-50 flex items-center hover:border-primary transition shadow-sm">
            <Server className="w-12 h-12 text-primary mr-4" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Server Status</p>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <p className="text-green-600 font-bold">Online & Stable</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-xl bg-gray-50 flex items-center hover:border-primary transition shadow-sm">
            <Database className="w-12 h-12 text-primary mr-4" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Master DB</p>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <p className="text-green-600 font-bold">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border rounded-xl bg-gray-50 flex items-center hover:border-primary transition shadow-sm">
            <Users className="w-12 h-12 text-primary mr-4" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Shops</p>
              <p className="font-black text-gray-900 text-2xl">{shops.length}</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4 border-b pb-2">Active Shops Directory (Live Postgres)</h2>
        {isLoading ? (
           <div className="text-center p-8 bg-gray-50 font-medium text-gray-500">Connecting to database...</div>
        ) : (
          <div className="overflow-x-auto border rounded-xl mb-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Shop ID</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Shop Name</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Location</th>
                  <th className="p-4 text-xs tracking-wider text-gray-500 font-bold uppercase">Assigned Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shops.map(s => (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 whitespace-nowrap text-sm font-mono font-medium text-gray-700">{s.shopId}</td>
                    <td className="p-4 font-bold text-gray-900">{s.name}</td>
                    <td className="p-4 text-sm text-gray-600">{s.village}, {s.district}</td>
                    <td className="p-4">
                      {s.assignedOfficer ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                          {s.assignedOfficer.name || 'Assigned'}
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                          Unassigned
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
export default AdminDashboard;