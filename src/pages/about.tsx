import Image from 'next/image';
import Link from 'next/link';
import { Building2, Users, Clock, Heart, Globe2, Zap, Shield } from 'lucide-react';

export default function About() {
  const stats = [
    { value: '25+', label: 'Construction Companies', icon: Building2 },
    { value: '100+', label: 'Active Projects', icon: Clock },
    { value: '500+', label: 'Site Supervisors', icon: Users },
    { value: '98%', label: 'Client Satisfaction', icon: Heart }
  ];

  const values = [
    {
      icon: Globe2,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to provide cutting-edge solutions for construction monitoring.'
    },
    {
      icon: Shield,
      title: 'Reliability',
      description: 'Building trust through consistent, dependable service and robust technology.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Fostering strong partnerships with our clients and within the construction industry.'
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'Streamlining processes to save time and resources for all stakeholders.'
    }
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'Founder & CEO',
      image: '/images/logo.jpg',
      bio: 'Former construction manager with 15 years of experience in project management.'
    },
    {
      name: 'Jane Smith',
      role: 'CTO',
      image: '/images/logo.jpg',
      bio: 'Tech innovator with a passion for bringing digital solutions to traditional industries.'
    },
    {
      name: 'Michael Johnson',
      role: 'Head of Operations',
      image: '/images/logo.jpg',
      bio: 'Operations expert specializing in scaling technology solutions for enterprise clients.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full opacity-60 blur-xl"></div>
          </div>
          <h1 className="relative text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            About <span className="text-blue-600">UjenziIQ</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Transforming construction project monitoring with real-time communication and insights
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mt-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform -skew-y-6"></div>
          <div className="relative bg-white rounded-xl shadow-lg p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                At UjenziIQ, we&apos;re committed to revolutionizing construction project monitoring by bridging the communication gap between site supervisors and project stakeholders. Our platform enables real-time updates and transparent communication, ensuring projects stay on track and within budget.
              </p>
              <div className="mt-8 inline-flex items-center text-blue-600 font-medium hover:text-blue-500 transition-colors">
                Learn more about our story 
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 relative">
          <div className="absolute inset-0 h-1/2 bg-blue-50"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} 
                    className="bg-white rounded-xl shadow-sm p-8 text-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 text-blue-600 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-4xl font-extrabold text-blue-600 mb-2">{stat.value}</p>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} 
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {team.map((member) => (
              <div 
                key={member.name} 
                className="bg-white rounded-xl shadow-sm p-8 text-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative mx-auto h-40 w-40 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-10"></div>
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="rounded-full object-cover ring-4 ring-white"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
                <div className="mt-4 flex justify-center space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-600 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-600 to-transparent"></div>
          </div>
          <div className="relative text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Transform Your Construction Monitoring?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join the growing number of construction companies using UjenziIQ
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/phone"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
