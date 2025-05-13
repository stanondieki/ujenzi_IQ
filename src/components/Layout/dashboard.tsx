import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Navbar />
      </div>
      
      {/* Content area with proper spacing */}
      <div className="pt-16"> {/* Add padding-top to account for fixed navbar height */}
        <div className="flex">
          <Sidebar userRole={userData?.role} />
          
          {/* Main content with responsive padding */}
          <main className="flex-1 p-6 lg:ml-64 transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;