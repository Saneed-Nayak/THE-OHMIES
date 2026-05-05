import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LogOut, Home, FileText, Users, Store, ShieldAlert, BarChart2, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  const role = user.role;

  let links = [];

  if (role === 'officer') {
    links = [
      { to: '/officer', icon: Home, label: 'Dashboard' },
      { to: '/officer/record', icon: FileText, label: 'Record' },
      { to: '/officer/history', icon: BarChart2, label: 'History' },
      { to: '/officer/beneficiaries', icon: Users, label: 'Beneficiaries' },
    ];
  } else if (role === 'supervisor') {
    links = [
      { to: '/supervisor', icon: Home, label: 'Dashboard' },
      { to: '/supervisor/conflicts', icon: ShieldAlert, label: 'Conflicts' },
      { to: '/supervisor/transactions', icon: FileText, label: 'Transactions' },
      { to: '/supervisor/shops', icon: Store, label: 'Shops' },
    ];
  } else if (role === 'admin') {
    links = [
      { to: '/admin', icon: Home, label: 'Dashboard' },
      { to: '/admin/beneficiaries', icon: Users, label: 'Beneficiaries' },
      { to: '/admin/shops', icon: Store, label: 'Shops' },
      { to: '/admin/users', icon: Users, label: 'Users' },
      { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
    ];
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white border-r shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col h-full">
          <div className="flex flex-col p-4 border-b">
            <h2 className="text-lg sm:text-xl font-black text-primary flex items-center">
              <Store className="mr-2 w-5 h-5" /> RationTrack
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 mt-1 capitalize bg-gray-100 px-2 py-0.5 rounded-full inline-block w-max">
              Role: {role}
            </span>
          </div>

          <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => onClose()}
                  className={`flex items-center py-2.5 px-3 sm:px-4 rounded-lg font-medium transition tap-target ${
                    active 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 sm:p-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full py-2.5 px-3 sm:px-4 rounded-lg text-red-600 hover:bg-red-50 font-medium transition tap-target"
            >
              <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;