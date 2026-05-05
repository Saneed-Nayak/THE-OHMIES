import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import SyncStatusPill from './SyncStatusPill';
import { Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthContext();
  
  if (!user) return null;

  return (
    <header className="bg-gray-900 text-white h-14 fixed w-full top-0 z-40 flex items-center justify-between px-4 sm:px-6 shadow-md">
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition tap-target"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h1 className="text-base sm:text-lg font-bold hidden sm:block">RationTrack</h1>
      </div>
      
      <div className="flex items-center space-x-3 sm:space-x-6">
        {user.role === 'officer' && <SyncStatusPill />}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-600 flex items-center justify-center font-bold text-white uppercase text-sm">
            {user.name.charAt(0)}
          </div>
          <span className="font-medium hidden md:inline text-sm">{user.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;