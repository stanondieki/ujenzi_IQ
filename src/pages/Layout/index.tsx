'use client';

import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Define paths where Navbar should be hidden
  const hideNavbarRoutes = ['/', '/landing', '/auth/login', '/auth/register'];
  
  // Define paths where Footer should be shown (public pages)
  const showFooterRoutes = ['/about', '/features', '/pricing', '/demo', '/contact'];
  
  const showNavbar = !hideNavbarRoutes.includes(pathname);
  const showFooter = showFooterRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className={`${showNavbar ? 'pt-16' : ''} flex-grow`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
