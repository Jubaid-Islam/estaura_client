import React, { useEffect, useRef, useState, memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router';

const CityCard = memo(({ city, index, isVisible, isDesktop = false }) => {


  const baseClasses = isDesktop 
    ? `relative group overflow-hidden rounded-2xl h-[300px] bg-gray-200 ${city.span || ''}`
    : `group flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100 cursor-pointer will-change-transform`;

  const animationClasses = `transform transition-all duration-700 ease-out 
    ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`;


  return (
    <div
      className={`${baseClasses} ${animationClasses}`}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
    >
      {isDesktop ? (
        <>
          <img
            src={city.image}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
            alt={city.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 p-6 flex flex-col text-white">
            <span className="text-xs uppercase font-medium">{city.count} Properties</span>
            <h3 className="text-2xl font-bold">{city.name}</h3>
          </div>
        </>
      ) : (
        <>
          <div className="h-16 w-16 overflow-hidden rounded-xl flex-shrink-0 bg-gray-100">
            <img
              src={city.image}
              alt={city.name}
              loading="lazy"
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {city.name}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              {city.count} {city.count === 1 ? 'Property' : 'Properties'}
            </p>
          </div>
        </>
      )}
    </div>
  );
});

const FeaturedCities = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const cities = [
    { id: 1, name: 'New York', count: 8, image: 'https://plus.unsplash.com/premium_photo-1682656220562-32fde8256295?q=80&w=600', span: 'md:col-span-2' },
    { id: 2, name: 'Chicago', count: 0, image: 'https://images.unsplash.com/photo-1643217353845-7f76ed50809d?q=80&w=600' },
    { id: 3, name: 'Los Angeles', count: 2, image: 'https://plus.unsplash.com/premium_photo-1742457641552-bbcbe12fd1f7?q=80&w=600' },
    { id: 4, name: 'San Diego', count: 1, image: 'https://plus.unsplash.com/premium_photo-1697730142151-c6ce356c1167?q=80&w=600' },
    { id: 5, name: 'Florida', count: 2, image: 'https://images.unsplash.com/photo-1656261443293-02c750b32bb5?q=80&w=600' },
    { id: 6, name: 'Miami', count: 2, image: 'https://images.unsplash.com/photo-1634435359023-d86108b66d80?q=80&w=600', span: 'md:col-span-2' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* Desktop Version */}
      <section className=" max-w-7xl mx-auto md:py-12 px-4 dm-sans overflow-hidden">

          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-gray-700 tracking-tight">Find Properties</h2>
            <div className='mb-6'>
            <p className="text-gray-500">Explore top cities with best deals</p>
            </div>
          </div>
  
<div className='hidden md:block'>

        <div className=" grid grid-cols-1 md:grid-cols-4 gap-6">
          {cities.map((city, index) => (
            <CityCard 
            key={city.id} 
            city={city} 
            index={index} 
            isVisible={isVisible} 
            isDesktop={true} 
            />
          ))}
        </div>
          </div>
      </section>

      {/* Mobile Version */}
      <section className="md:hidden dm-sans py-10 px-4 max-w-7xl mx-auto bg-transparent overflow-hidden">

        <div className="grid grid-cols-2 gap-4">
          {cities.map((city, index) => (
            <CityCard 
              key={city.id} 
              city={city} 
              index={index} 
              isVisible={isVisible} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default FeaturedCities;