"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { HiMenu, HiX } from "react-icons/hi";

export default function AdminLayoutClient({ children, email }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless open, visible on desktop */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <AdminSidebar onMobileClick={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <HiMenu className="text-2xl" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Admin Portal</h2>
          </div>
          <span className="text-xs sm:text-sm text-gray-500 truncate max-w-[150px] sm:max-w-none">{email}</span>
        </header>
        
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
