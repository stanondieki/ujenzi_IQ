import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowRight, 
  MessageSquare, 
  Activity, 
  Bell, 
  ClipboardList,
  ChevronRight,
  Phone,
  Lock,
  Users,
  Menu,
  X
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/images/logo.jpg"
                alt="UjenziIQ Logo"
                width={40}
                height={40}
                className="w-auto h-10 rounded-md"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">UjenziIQ</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/features"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                About
              </Link>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
              >
                <Lock className="h-4 w-4 mr-1" />
                Login
              </Link>
              <Link
                href="/phone"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center transition-all duration-200 transform hover:scale-105"
              >
                <Phone className="h-4 w-4 mr-1" />
                Register as Supervisor
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />                )}
              </button>
            </div>

            {/* Mobile menu panel */}
            <div 
              className={`
                md:hidden fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
            >
              {/* Overlay */}
              <div 
                className={`
                  absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm transition-opacity duration-300
                  ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu content */}
              <div className="relative w-4/5 max-w-sm h-full bg-white shadow-xl">
                <div className="flex flex-col h-full py-6 overflow-y-scroll">
                  <div className="px-4 mb-8 flex items-center">
                    <Image
                      src="/images/logo.jpg"
                      alt="UjenziIQ Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-md"
                    />
                    <span className="ml-2 text-lg font-bold text-gray-900">UjenziIQ</span>
                  </div>

                  <nav className="px-4 space-y-2">
                    <Link
                      href="/features"
                      className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="/pricing"
                      className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link
                      href="/about"
                      className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      About
                    </Link>

                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <Link
                        href="/auth/login"
                        className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Lock className="h-5 w-5 mr-2" />
                        Login
                      </Link>
                      <Link
                        href="/phone"
                        className="mt-2 flex items-center justify-center px-3 py-2.5 rounded-lg text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Phone className="h-5 w-5 mr-2" />
                        Register as Supervisor
                      </Link>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-blue-100" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-blue-100" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
            </svg>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <span>New: SMS Integration Available</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Real-time</span>{' '}
                <span className="block text-blue-600 xl:inline">Construction Monitoring</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Monitor construction projects in real-time, receive instant alerts, and improve communication across all stakeholders. The smart way to manage your construction projects.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Key Features */}
                  {[
                    { text: 'SMS Updates & Alerts', icon: <MessageSquare className="h-5 w-5 text-blue-500" /> },
                    { text: 'Real-time Dashboard', icon: <Activity className="h-5 w-5 text-blue-500" /> },
                    { text: 'Stakeholder Management', icon: <Users className="h-5 w-5 text-blue-500" /> },
                    { text: 'Project Tracking', icon: <ClipboardList className="h-5 w-5 text-blue-500" /> }
                  ].map((feature) => (
                    <div key={feature.text} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                      {feature.icon}
                      <span className="ml-2 text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                  <Link
                    href="/phone"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-md transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    Request Demo
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-xl lg:max-w-md overflow-hidden">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <Image
                    src="/images/site.jpg"
                    alt="Dashboard Preview"
                    width={500}
                    height={300}
                    className="w-full transform transition duration-700 hover:scale-105"
                  />
                  {/* Play button overlay 
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <button className="bg-blue-600 rounded-full p-3 text-white hover:bg-blue-700 transition-colors duration-200 shadow-lg">
                      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div> */}
                </div>
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-yellow-400 rounded-full opacity-20"></div>
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-24 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {[
                { value: '97%', label: 'Improvement in reporting time' },
                { value: '83%', label: 'Stakeholders satisfaction rate' },
                { value: '29%', label: 'Reduction in project delays' }
              ].map((stat, index) => (
                <div key={index} className="px-6 py-8 text-center">
                  <p className="text-4xl font-extrabold text-blue-600">{stat.value}</p>
                  <p className="mt-1 text-base text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-24">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-base text-gray-500 sm:text-xl lg:text-lg xl:text-xl">
                Our platform simplifies construction monitoring in three easy steps
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Site Updates via SMS',
                  description: 'Supervisors send updates using simple SMS commands from any phone, no smartphone required',
                  icon: <MessageSquare className="h-8 w-8 text-white" />
                },
                {
                  title: 'Real-time Processing',
                  description: 'Updates are instantly processed and reflected on the dashboard for immediate action',
                  icon: <Activity className="h-8 w-8 text-white" />
                },
                {
                  title: 'Stakeholder Notifications',
                  description: 'Automatic alerts are sent to relevant stakeholders based on update type and severity',
                  icon: <Bell className="h-8 w-8 text-white" />
                }
              ].map((step, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 relative overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-400 rounded-full opacity-10"></div>
                  <div className="relative">
                    <div className="bg-blue-600 rounded-2xl w-14 h-14 flex items-center justify-center mb-6">
                      {step.icon}
                    </div>
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                      {index + 1}
                    </span>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Testimonial Section */}
          <div className="mt-24 bg-blue-700 rounded-xl overflow-hidden shadow-xl relative">
            <div className="absolute right-0 top-0 w-40 h-40 bg-blue-500 rounded-full opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute left-0 bottom-0 w-40 h-40 bg-blue-500 rounded-full opacity-20 -ml-20 -mb-20"></div>
            <div className="relative px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center">
              <div className="md:w-3/4">
                <p className="text-xl md:text-2xl font-medium text-white">
                  &quot;UjenziIQ has transformed how we monitor construction projects. We now have real-time visibility and can address issues before they become problems.&quot;
                </p>
                <div className="mt-6">
                  <p className="text-base font-medium text-blue-200">Sarah Johnson</p>
                  <p className="text-sm text-blue-300">Project Manager, Construct Co Ltd</p>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:w-1/4 flex justify-center">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image
                      className="h-12 w-auto"
                      src="/images/logo.jpg"
                      alt="Client Logo"
                      width={48}
                      height={48}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ready to transform your construction monitoring?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Join hundreds of construction firms already using UjenziIQ
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/phone"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started Now
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <Image
                  src="/images/logo.jpg"
                  alt="UjenziIQ Logo"
                  width={40}
                  height={40}
                  className="w-auto h-10 rounded-md"
                />
                <span className="ml-2 text-xl font-bold text-white">UjenziIQ</span>
              </div>
              <p className="mt-4 text-gray-400 text-sm">
                Real-time construction monitoring solution that connects supervisors, stakeholders, and project managers.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Product</h3>              <ul className="mt-4 space-y-2">
                {[
                  { name: 'Features', href: '/features' },
                  { name: 'Pricing', href: '/pricing' },
                  { name: 'Demo', href: '/demo' },
                  { name: 'FAQ', href: '/faq' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>              <ul className="mt-4 space-y-2">
                {[
                  { name: 'About', href: '/about' },
                  { name: 'Careers', href: '/careers' },
                  { name: 'Contact', href: '/contact' },
                  { name: 'Partners', href: '/partners' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>              <ul className="mt-4 space-y-2">
                {[
                  { name: 'Privacy', href: '/legal/privacy' },
                  { name: 'Terms', href: '/legal/terms' },
                  { name: 'Security', href: '/legal/security' },
                  { name: 'Cookie Policy', href: '/legal/cookies' }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-400 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} UjenziIQ. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">              {[
                {
                  name: 'facebook',
                  href: 'https://facebook.com/ujenziiq',
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                      <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                },
                {
                  name: 'twitter',
                  href: 'https://twitter.com/ujenziiq',
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  ),
                },
                {
                  name: 'linkedin',
                  href: 'https://linkedin.com/company/ujenziiq',
                  icon: (props: React.SVGProps<SVGSVGElement>) => (
                    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}