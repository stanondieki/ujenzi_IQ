import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, Building2, Users, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Demo() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    projectSize: 'small',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
            <p className="mt-4 text-lg text-gray-600">
              We&apos;ve received your demo request. Our team will contact you within 24 hours to schedule your personalized demo.
            </p>
            <div className="mt-8 p-4 bg-green-50 rounded-lg text-green-800">
              <p className="font-medium">What happens next?</p>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Our team will review your requirements
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  We&apos;ll prepare a personalized demo
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Schedule a time that works best for you
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Experience the Future of <span className="text-blue-600">Construction Monitoring</span>
          </h1>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Schedule a personalized demo and see how UjenziIQ can transform your construction project monitoring
          </p>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-2 lg:gap-8 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -translate-x-16 -translate-y-16 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full translate-x-16 translate-y-16 opacity-20"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Request Your Demo</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="projectSize" className="block text-sm font-medium text-gray-700">
                    Project Size
                  </label>
                  <select
                    name="projectSize"
                    id="projectSize"
                    required
                    value={formData.projectSize}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="small">Small (1-5 projects)</option>
                    <option value="medium">Medium (6-15 projects)</option>
                    <option value="large">Large (16+ projects)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Additional Information
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Tell us about your specific needs..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg
                    text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    transform transition-all duration-200 hover:scale-105 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }
                  `}
                >
                  {loading ? 'Submitting...' : (
                    <>
                      Request Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-12 lg:mt-0">
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What to Expect</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Calendar className="h-6 w-6 text-blue-500 mt-1" />
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">30-Minute Personalized Demo</h4>
                      <p className="text-gray-600">See UjenziIQ in action with your specific use cases</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Users className="h-6 w-6 text-blue-500 mt-1" />
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Expert Consultation</h4>
                      <p className="text-gray-600">Discuss your needs with our construction tech experts</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Building2 className="h-6 w-6 text-blue-500 mt-1" />
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">Custom Solution Design</h4>
                      <p className="text-gray-600">Get a tailored plan for your organization</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-x-16 -translate-y-16 opacity-10"></div>
                <div className="relative">                  <p className="text-xl font-medium italic">
                    &ldquo;UjenziIQ has completely transformed how we manage our construction projects. The real-time updates and seamless communication have improved our efficiency by 60%.&rdquo;
                  </p>
                  <div className="mt-4 flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src="/images/site.jpg"
                        alt="Client"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-blue-200">Project Director, BuildTech Inc</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
