import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import OfflineBanner from './components/common/OfflineBanner';
import { useAuthContext } from './context/AuthContext';

const Layout = () => {
  const { isAuthenticated } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineBanner />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex pt-14">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:ml-64 overflow-y-auto h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;