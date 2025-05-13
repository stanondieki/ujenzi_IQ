'use client';

import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Define paths where Navbar should be hidden
  const hideNavbarRoutes = ['/', '/landing', '/auth/login', '/auth/register'];

  const showNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className={`${showNavbar ? 'pt-16' : ''} flex-grow`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
