import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { currentUser, userData, signOut } = useAuth();
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Handle scroll effect with smoother transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Projects', href: '/projects', icon: DocumentTextIcon },
    ...(userData?.role === 'admin' ? [
      { name: 'Stakeholders', href: '/stakeholders', icon: UserGroupIcon },
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon }
    ] : [])
  ];

  // Sample notifications for the dropdown
  const notifications = [
    { 
      id: 1, 
      title: 'Project update', 
      message: 'New comment on Project A', 
      time: '5m ago', 
      isRead: false,
      type: 'update'
    },
    { 
      id: 2, 
      title: 'Task completed', 
      message: 'Foundation assessment complete', 
      time: '1h ago', 
      isRead: false,
      type: 'success'
    },
    { 
      id: 3, 
      title: 'New document', 
      message: 'Contract documents uploaded', 
      time: '3h ago', 
      isRead: true,
      type: 'info'
    }
  ];
  
  return (    <nav 
      className="fixed top-0 right-0 left-0 z-30 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">            <Link href="/" className="flex items-center">
              <div className="h-9 w-9 rounded bg-blue-600 flex items-center justify-center mr-3">
                <span className="font-bold text-xl text-white">U</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">UjenziIQ</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-baseline space-x-1">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;
                
                return (                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      px-3 py-2 text-sm font-medium flex items-center
                      ${isActive 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'}
                    `}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'mr-1.5' : 'mr-1'} ${isActive && !isScrolled ? 'text-white' : ''}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* User Profile and Notifications */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Notification Bell */}
            <div className="relative" ref={notificationsRef}>              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 relative"
                aria-label="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden transform transition-all duration-200 ease-out">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                      {notifications.filter(n => !n.isRead).length} new
                    </span>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-l-4 ${
                          notification.isRead ? 'border-transparent' : 'border-blue-500'
                        }`}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1.5 text-gray-700 hover:text-blue-600"
                aria-label="User menu"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center overflow-hidden ${
                  isScrolled ? 'ring-2 ring-gray-200' : 'ring-2 ring-white/30'
                }`}>
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt="User avatar" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className={`h-full w-full flex items-center justify-center ${
                      isScrolled ? 'bg-blue-100 text-blue-600' : 'bg-white/20 text-white'
                    }`}>
                      <span className="font-medium text-sm">
                        {(userData?.displayName || currentUser?.email || 'User')?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs hidden lg:block">
                  <p className="font-medium truncate max-w-[100px]">
                    {userData?.displayName || currentUser?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className={`text-xs capitalize ${isScrolled ? 'text-gray-500' : 'text-blue-100'}`}>
                    {userData?.role || 'User'}
                  </p>
                </div>
                <ChevronDownIcon 
                  className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userData?.displayName || currentUser?.email || currentUser?.phoneNumber}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {userData?.role || 'User'}
                    </p>
                  </div>
                  
                  <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <UserCircleIcon className="h-4 w-4 mr-3 text-gray-500" />
                    Your Profile
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-500" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - with smoother animation */}
      <div 
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 invisible'
        }`}
      >
        <div className={`px-3 pt-1 pb-3 space-y-1.5 shadow-inner ${isScrolled ? 'bg-gray-50' : 'bg-blue-700'}`}>
          {navLinks.map((link) => {
            const isActive = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  block px-4 py-2.5 rounded-lg text-base font-medium flex items-center
                  transition-all duration-200
                  ${isActive 
                    ? isScrolled 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-blue-800 text-white' 
                    : isScrolled 
                      ? 'text-gray-600 hover:bg-gray-100' 
                      : 'text-blue-50 hover:bg-blue-800'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {link.name}
              </Link>
            );
          })}
          
          {/* Mobile notifications */}
          <div className={`my-2 rounded-lg overflow-hidden ${
            isScrolled ? 'bg-white' : 'bg-blue-800'
          }`}>
            <div className={`px-4 py-2 flex items-center justify-between ${
              isScrolled ? 'border-b border-gray-100' : 'border-b border-blue-700'
            }`}>
              <h3 className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                Recent Notifications
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isScrolled ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-100'
              }`}>
                {notifications.filter(n => !n.isRead).length} new
              </span>
            </div>
            
            <div className="max-h-40 overflow-y-auto">
              {notifications.slice(0, 2).map((notification) => (
                <div 
                  key={notification.id}
                  className={`px-4 py-2 ${
                    isScrolled 
                      ? notification.isRead ? '' : 'border-l-2 border-blue-500' 
                      : notification.isRead ? '' : 'border-l-2 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                      {notification.title}
                    </p>
                    <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-blue-200'}`}>
                      {notification.time}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isScrolled ? 'text-gray-600' : 'text-blue-100'}`}>
                    {notification.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`border-t my-2 ${isScrolled ? 'border-gray-200' : 'border-blue-600'}`}></div>
          
          {/* Mobile user profile */}
          <div className={`px-4 py-3 rounded-lg ${isScrolled ? 'bg-white' : 'bg-blue-800'}`}>
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center overflow-hidden ${
                isScrolled ? 'bg-blue-100' : 'bg-blue-900'
              }`}>
                {currentUser?.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="User avatar" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className={`font-medium text-sm ${isScrolled ? 'text-blue-600' : 'text-blue-100'}`}>
                    {(userData?.displayName || currentUser?.email || 'User')?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className={`font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  {userData?.displayName || currentUser?.email?.split('@')[0] || currentUser?.phoneNumber}
                </p>
                <p className={`text-xs mt-0.5 ${isScrolled ? 'text-gray-500' : 'text-blue-200'}`}>
                  {userData?.role && `Role: ${userData.role}`}
                </p>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/profile" 
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${
                  isScrolled 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-700 text-blue-50 hover:bg-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircleIcon className="h-4 w-4 mr-1" />
                Profile
              </Link>
              <Link href="/settings" 
                className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium ${
                  isScrolled 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-700 text-blue-50 hover:bg-blue-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Cog6ToothIcon className="h-4 w-4 mr-1" />
                Settings
              </Link>
            </div>
            
            <button
              onClick={handleSignOut}
              className={`w-full mt-3 text-center px-3 py-2 rounded-lg text-sm font-medium
                ${isScrolled 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-red-600 text-white hover:bg-red-700'}
                transition-colors duration-200
              `}
            >
              <div className="flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1.5" />
                Sign Out
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;