import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Topbar from '../components/dashboard/topbar/Topbar';
import Sidebar from '../components/dashboard/sidebar/Sidebar';

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;