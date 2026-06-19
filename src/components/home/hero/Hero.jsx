import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import PropertySearch from './PropertySearch';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);


  const images = [
    "https://images.unsplash.com/photo-1707074743640-4cd022c3e58c?q=80&w=2089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=80",
    "https://images.unsplash.com/photo-1731447047354-094f082c2890?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  // Start automatic slideshow
  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
  }, [images.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTimer]);

  const companies = [
    "Uldeck",
    "Ayro UI",
    "TailAdmin",
    "lineicons",
    "graygrids"
  ];

  // Duplicate the array to create a seamless infinite loop
  const scrollingCompanies = [...companies, ...companies, ...companies];

  const users = [
    { id: 1, img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, img: 'https://randomuser.me/api/portraits/men/46.jpg' },
  ];

  return (
    <div className=''>

      <div className="dm-sans relative min-h-[750px] items-center overflow-hidden">
        {/* Background Slideshow Container */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{ opacity: currentImageIndex === index ? 1 : 0 }}
            >
              <img
                src={image}
                alt={`Property background ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>


        <div className="absolute inset-0 bg-black/20 z-10"></div>

        {/* Content Section */}
        <div className="relative z-20 mt-20 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center max-w-4xl mx-auto text-white">
              {/* Subheading */}
              <p className="text-sm md:text-base font-semibold tracking-wider uppercase mb-2 md:mb-3">
                LET US GUIDE YOUR HOME
              </p>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Find Your Dream Home.
              </h1>

              {/* Discount Offer */}
              <div className="inline-flex items-center gap-2 bg-indigo-600/30 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium mb-6 md:mb-8">
                <span>From as low as $10 per day with limited time offer discounts</span>
              </div>
            </div>

            {/* Property Search Component */}
            <div className="max-w-4xl mx-auto mt-6 md:mt-8">
              <PropertySearch />
            </div>
          </div>
        </div>


        {/* people */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-center gap-4">
          {/* Avatar Stack */}
          <div className="flex -space-x-3 transition-space duration-300">
            {users.map((user) => (
              <div
                key={user.id}
                className="relative group cursor-pointer"
              >
                <img
                  src={user.img}
                  alt="Active User"
                  className="h-10 w-10 rounded-full border-[3px] border-white object-cover shadow-sm group-hover:translate-y-[-4px] transition-transform duration-300"
                />
                {/* Hover state ring */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center">
            <h4 className="text-xs font-medium text-white leading-none mb-0.5">
              12K customer
            </h4>
            <a href='#customer-review'
              className="underline group flex items-center gap-1.5 text-xs md:text-sm font-bold text-white hover:text-indigo-500 transition-colors duration-200">
              View More
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200 text-indigo-100"
              />
            </a>
          </div>
        </div>
      </div>

      {/* companies */}
      <div className="dm-sans py-12 md:py-16 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 md:mb-10">
            <p className="text-gray-600 text-sm md:text-base uppercase tracking-wide font-semibold">
              Trusted by 10,000 Companies worldwide
            </p>
          </div>

          {/* Marquee Container */}
          <div className="relative w-full overflow-hidden">
            {/* Gradient masks for smooth edge fading  */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling Track */}
            <div className="flex animate-scrollRightToLeft">
              {scrollingCompanies.map((company, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 mx-6 md:mx-8 py-3 px-5 md:px-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <span className="text-gray-700 font-semibold text-base md:text-lg whitespace-nowrap">
                    {company}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <style>{`
        @keyframes scrollRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%); /* since we have 3 copies, shift by one third */
          }
        }
        .animate-scrollRightToLeft {
          animation: scrollRightToLeft 20s linear infinite;
          width: max-content;
        }
        .animate-scrollRightToLeft:hover {
          animation-play-state: paused;
        }
      `}</style>
      </div>

    </div>
  );
};

export default Hero;