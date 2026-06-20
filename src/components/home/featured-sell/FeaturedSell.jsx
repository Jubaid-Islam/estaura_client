import React, { useState, useEffect, useRef } from 'react';
import { Home, DollarSign, ShieldCheck, ArrowRight, TrendingUp, Users, Award } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const FeaturedSell = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const benefits = [
    {
      id: 1,
      icon: <Home className="text-indigo-500" size={28} />,
      title: "Easy Listing",
      desc: "List your property with detailed info in just 5 minutes.",
    },
    {
      id: 2,
      icon: <ShieldCheck className="text-indigo-500" size={28} />,
      title: "Verified Buyers",
      desc: "We ensure all potential buyers are pre-verified for your safety.",
    },
    {
      id: 3,
      icon: <DollarSign className="text-indigo-500" size={28} />,
      title: "Best Value",
      desc: "Get the maximum market value for your premium property.",
    },
  ];

  const stats = [
    { label: "Happy Sellers", value: "10K+", icon: <Users size={18} /> },
    { label: "Properties Sold", value: "$2.5B+", icon: <TrendingUp size={18} /> },
    { label: "Success Rate", value: "98%", icon: <Award size={18} /> },
  ];

  // Intersection Observer – triggers on every scroll in/out
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" } 
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white dm-sans overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* left section */}
          <div
            className={`relative group transition-all duration-700 ease-out will-change-transform
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          >
            <div className="py-4 flex justify-center -mt-20">
              <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                <TrendingUp size={16} className="text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700 tracking-wide">
                  SELL FASTER & SMARTER
                </span>
              </div>
            </div>
            {/* Main Image Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200/50">
              <img
                src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Sell Property"
                className="w-full h-[420px] md:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm py-2.5 px-5 rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
                <div className="bg-green-100 p-2 rounded-full">
                  <DollarSign className="text-green-600" size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Top Deal Today</p>
                  <p className="text-sm font-bold text-gray-900">$1.2M Property Sold</p>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="absolute bottom-6 right-6 bg-indigo-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                <Award size={14} /> No Commission Fees
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-indigo-600 rounded-full -z-10 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700"></div>
            <div className="absolute -top-5 -left-5 w-32 h-32 bg-indigo-300 rounded-full -z-10 opacity-10 blur-2xl"></div>
          </div>

          {/* right section */}
          <div
            className={`space-y-8 transition-all duration-700 ease-out will-change-transform
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div className="space-y-4">
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                Want to Sell Your{" "}
                <span className="text-indigo-600 relative inline-block">
                  Property?
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2 text-indigo-200"
                    viewBox="0 0 200 8"
                    fill="currentColor"
                  >
                    <path d="M0,5 Q50,0 100,5 T200,5" stroke="none" fill="currentColor" />
                  </svg>
                </span>
              </h2>
              <p className="text-xs md:text-lg text-gray-600 leading-relaxed">
                Join over 10,000+ owners who sold their properties through our platform with 0% hassle. Get expert
                guidance, premium exposure, and close deals faster.
              </p>
            </div>

            {/* Benefits List */}
            <section className='hidden md:block'>

            <div className="grid grid-cols-1 gap-4">
              {benefits.map((item, index) => (
                  <div
                  key={item.id}
                  className="group/benefit flex gap-5 p-5 rounded-xl transition-all duration-300 bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1 cursor-default"
                  style={{ transitionDelay: `${index * 50}ms` }}
                  >
                  <div className="flex bg-indigo-50 p-3 items-center rounded-xl transition-all group-hover/benefit:bg-indigo-100">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 group-hover/benefit:text-indigo-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
              </section>

            {/* Trust Metrics */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 border-t border-gray-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="text-indigo-500 bg-indigo-50 p-1.5 rounded-full">{stat.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center lg:justify-start flex-row gap-4 pt-4">
              <NavLink
                to="/sell"
                className="inline-flex items-center justify-center gap-2 bg-indigo-600/90 text-white px-4  md:px-8 py-4 rounded-xl font-bold text-xs hover:bg-indigo-700/90 transition-all shadow-xl shadow-indigo-50 hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                List Your Property
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </NavLink>
              <NavLink
                to="/learn-more"
                className="inline-flex items-center justify-center px-4 md:px-8 py-4 rounded-xl text-xs font-bold text-gray-700 border-2 border-gray-200 hover:bg-indigo-50 transition-all group"
              >
                Learn More
                <ArrowRight
                  size={18}
                  className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSell;