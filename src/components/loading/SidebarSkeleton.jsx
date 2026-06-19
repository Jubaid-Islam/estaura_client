import React from 'react';

export default function SidebarSkeleton() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col animate-pulse">
      {/* Logo / Header Area */}
      <div className="p-5 border-b border-gray-100">
        <div className="h-8 w-3/4 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-3">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </nav>

      {/* User / Footer Section */}
      <div className="p-5 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}