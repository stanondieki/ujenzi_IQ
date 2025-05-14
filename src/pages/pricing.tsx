export default function Pricing() {
  const plans = [
    {
      name: 'Basic',
      price: '499',
      description: 'Perfect for small construction companies',
      badge: 'Most Popular',
      features: [
        'Up to 5 active projects',
        'SMS updates for 10 supervisors',
        'Basic reporting',
        'Email support',
        '1 admin user',
        'Basic analytics'
      ]
    },
    {
      name: 'Professional',
      price: '999',
      description: 'For growing construction businesses',
      features: [
        'Up to 15 active projects',
        'SMS updates for 25 supervisors',
        'Advanced reporting',
        'Priority email & phone support',
        '3 admin users',
        'Advanced analytics',
        'Custom alerts'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large construction companies',
      features: [
        'Unlimited projects',
        'Unlimited supervisors',
        'Custom reporting',
        '24/7 dedicated support',
        'Unlimited admin users',
        'Enterprise analytics',
        'API access',
        'Custom integrations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full opacity-60 blur-xl"></div>
          </div>
          <h1 className="relative text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Simple, Transparent <span className="text-blue-600">Pricing</span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Choose the perfect plan for your construction projects
          </p>
          
          {/* Pricing Toggle - Annual/Monthly */}
          <div className="mt-8 flex justify-center items-center space-x-3">
            <span className="text-gray-500">Monthly</span>
            <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none">
              <span className="translate-x-5 relative inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out">
                <span className="opacity-0 duration-100 ease-out absolute inset-0 flex h-full w-full items-center justify-center transition-opacity">
                  <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                  </svg>
                </span>
              </span>
            </button>
            <span className="text-gray-500">Annual <span className="text-green-500 text-sm">(Save 20%)</span></span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3 relative">
          {/* Decorative elements */}
          <div className="hidden lg:block absolute -left-4 -right-4 inset-y-1/2 transform -translate-y-1/2">
            <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl"></div>
          </div>

          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl shadow-sm p-8 ${
                plan.highlighted
                  ? 'ring-2 ring-blue-500 transform scale-105 shadow-xl'
                  : 'hover:shadow-xl'
              } transition-all duration-300 hover:-translate-y-1`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                {plan.badge && !plan.highlighted && (
                  <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                    {plan.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline text-gray-900">
                {plan.price === 'Custom' ? (
                  <span className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Contact Us
                  </span>
                ) : (
                  <>
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold text-gray-500">/month</span>
                  </>
                )}
              </div>

              <p className="mt-5 text-lg text-gray-500">{plan.description}</p>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className={`h-6 w-6 ${
                          plan.highlighted ? 'text-blue-500' : 'text-green-500'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <a
                  href={plan.price === 'Custom' ? '/contact' : '/phone'}
                  className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg ${
                    plan.highlighted
                      ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-xl'
                      : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  } transition-all duration-200 transform hover:scale-105`}
                >
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                q: "How does the monthly billing work?",
                a: "You'll be billed monthly on the date you signed up. You can upgrade, downgrade, or cancel your plan at any time."
              },
              {
                q: "Can I change plans later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "What kind of support do you offer?",
                a: "We offer email support for all plans, with priority support and phone support available on higher tiers."
              },
              {
                q: "Is there a free trial available?",
                a: "Yes, you can try UjenziIQ free for 14 days. No credit card required."
              }
            ].map((faq) => (
              <div key={faq.q} className="text-left bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-600 to-transparent"></div>
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-600 to-transparent"></div>
          </div>
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to transform your construction monitoring?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join hundreds of construction firms already using UjenziIQ
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="/phone"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
              >
                Start Free Trial
              </a>
              <a
                href="/demo"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
