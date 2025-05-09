import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userRole = 'user'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: DocumentTextIcon },
    ...(userRole === 'admin' ? [
      { name: 'Users', href: '/users', icon: UserGroupIcon }
    ] : []),
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const isActiveLink = (path: string) => router.pathname === path;

  return (
    <>
      {/* Mobile menu button - with subtle animation */}
      <div className="lg:hidden fixed top-20 left-4 z-30">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-full bg-white shadow-lg text-gray-700 hover:text-blue-600 hover:shadow-blue-100 transform hover:scale-105 transition-all duration-200"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop collapse button - with improved hover effect */}
      <div className="hidden lg:block fixed top-20 left-4 z-30">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full bg-white shadow-lg text-gray-700 hover:text-blue-600 hover:shadow-blue-100 transform hover:scale-105 transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <ChevronRightIcon className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Enhanced Sidebar */}
      <div className={`
        fixed top-16 bottom-0 left-0 z-20
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        bg-gradient-to-br from-blue-50 via-white to-blue-50
        shadow-xl
        border-r border-blue-100
        overflow-hidden
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation with enhanced visual styling */}
          <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
            <div className={`mb-8 px-6 ${isCollapsed ? 'hidden' : 'block'}`}>
            </div>
            
            <nav className={`space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center py-3 px-3 rounded-xl text-sm font-medium
                      transition-all duration-300 ease-in-out
                      ${active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-200'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}
                      ${isCollapsed ? 'justify-center' : ''}
                      transform hover:translate-x-1
                    `}
                  >
                    <Icon className={`
                      ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'}
                      ${active ? '' : 'group-hover:text-blue-600'}
                      transition-all duration-200
                    `} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                    {!isCollapsed && active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-200"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer/Logout with enhanced styling */}
          <div className="p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-transparent">
            <Link
              href="/"
              className={`
                flex items-center py-2 px-3 rounded-xl text-sm font-medium
                text-gray-700 hover:bg-red-50 hover:text-red-700 hover:shadow-sm
                transition-all duration-200
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <ArrowRightOnRectangleIcon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2 text-red-500'}`} />
              {!isCollapsed && (
                <span className="font-medium">Logout</span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced overlay for mobile with blur effect */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm z-10 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;