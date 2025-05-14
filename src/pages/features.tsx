import Link from 'next/link';
import { 
  MessageSquare, 
  Activity, 
  Bell, 
  ClipboardList,
  Users,
  BarChart,
  ArrowRight
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'SMS Updates & Alerts',
      description: 'Send and receive real-time updates via SMS from any phone, no smartphone required.',
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      details: [
        'Simple SMS commands for updates',
        'Real-time alerts for stakeholders',
        'Automated status notifications',
        'Configurable alert thresholds'
      ]
    },
    {
      title: 'Real-time Dashboard',
      description: 'Monitor all your projects in real-time with our intuitive dashboard.',
      icon: <Activity className="h-8 w-8 text-white" />,
      details: [
        'Live project status updates',
        'Progress tracking',
        'Issue monitoring',
        'Resource allocation view'
      ]
    },
    {
      title: 'Stakeholder Management',
      description: 'Efficiently manage and communicate with all project stakeholders.',
      icon: <Users className="h-8 w-8 text-white" />,
      details: [
        'Role-based access control',
        'Customizable notifications',
        'Stakeholder communication logs',
        'Document sharing'
      ]
    },
    {
      title: 'Project Tracking',
      description: 'Track milestones, progress, and issues for all your construction projects.',
      icon: <ClipboardList className="h-8 w-8 text-white" />,
      details: [
        'Milestone tracking',
        'Progress monitoring',
        'Issue management',
        'Task assignments'
      ]
    },
    {
      title: 'Automated Alerts',
      description: 'Get instant notifications about project updates and critical issues.',
      icon: <Bell className="h-8 w-8 text-white" />,
      details: [
        'Custom alert rules',
        'Priority-based notifications',
        'Multi-channel alerts',
        'Alert history tracking'
      ]
    },
    {
      title: 'Analytics & Reports',
      description: 'Generate detailed reports and analyze project performance metrics.',
      icon: <BarChart className="h-8 w-8 text-white" />,
      details: [
        'Custom report generation',
        'Performance analytics',
        'Trend analysis',
        'Export capabilities'
      ]
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,#f0f7ff_12%,transparent_12.5%,transparent_87%,#f0f7ff_87.5%,#f0f7ff_100%)] opacity-50"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center relative">
          <span className="inline-block">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-6 animate-bounce-slow">
              Powerful Features
            </span>
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Construction Management</span>
            <span className="block mt-2 text-blue-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">Made Simple</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-8">
            Everything you need to manage your construction projects effectively, from planning to completion
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/demo" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              Try Demo
            </Link>
            <Link href="/about" 
              className="inline-flex items-center px-6 py-3 border border-blue-200 text-base font-medium rounded-full text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-md p-8 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group overflow-hidden"
            >
              {/* Decorative corner gradients */}
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-br-3xl transition-all duration-300 group-hover:scale-150"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-tl-3xl transition-all duration-300 group-hover:scale-150"></div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 inline-block mb-4 shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center text-gray-600 group/item">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center transform transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-blue-200">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 group-hover/item:text-gray-900 transition-colors duration-200">
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -skew-y-1 rounded-3xl shadow-xl"></div>
          <div className="relative max-w-4xl mx-auto px-8 py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to Transform Your Construction Management?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of construction professionals who are already using UjenziIQ to streamline their projects.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white"
              >
                Start Free Trial
                <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 text-white font-semibold rounded-full border-2 border-white bg-transparent hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
