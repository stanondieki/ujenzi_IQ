import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { currentUser } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="UjenziIQ Logo"
                width={40}
                height={40}
                className="w-auto h-8"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">UjenziIQ</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/phone"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Register as Supervisor
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Real-time</span>
              <span className="block text-blue-600">Construction Monitoring</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Monitor construction projects in real-time, receive instant alerts, and improve communication across all stakeholders.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Key Features */}
                {[
                  'SMS Updates & Alerts',
                  'Real-time Dashboard',
                  'Stakeholder Management',
                  'Project Tracking'
                ].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <svg className="h-5 w-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="ml-2 text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <Image
                  src="/images/site.jpg"
                  alt="Dashboard Preview"
                  width={500}
                  height={300}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: 'Site Updates via SMS',
                description: 'Supervisors send updates using simple SMS commands from any phone'
              },
              {
                title: 'Real-time Processing',
                description: 'Updates are instantly processed and reflected on the dashboard'
              },
              {
                title: 'Stakeholder Notifications',
                description: 'Automatic alerts are sent to relevant stakeholders based on update type'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} UjenziIQ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}