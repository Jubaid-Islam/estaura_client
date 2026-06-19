import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import useProperties from '../../../hooks/property/useProperties';
import { cloudinaryUrl } from '../../../hooks/cloudniaryUrl';


const FeaturedRent = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [properties] = useProperties();
  const navigate = useNavigate()

  // filter Rent properties
  const rentProperties = properties?.filter(p => p.listingType === 'rent')
    // .sort((a, b) => new Date (b.createdAt) - new Date(a.createdAt))
    .slice(0, 8) || [];

  const indexRentProperties = rentProperties.slice(0, rentProperties.length - 2);


  // Function to calculate card width (including gap)
  const getCardTotalWidth = useCallback(() => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('.property-card');
      if (firstCard) {
        const cardWidthValue = firstCard.clientWidth;
        // Get gap from computed style or default 24px (gap-6)
        const gap = 24;
        return cardWidthValue + gap;
      }
    }
    return 390 + 24; // fallback: 390px card + 24px gap
  }, []);

  // Update active index based on scroll position
  const updateActiveIndex = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const totalWidth = getCardTotalWidth();
      const newIndex = Math.round(scrollLeft / totalWidth);
      setActiveIndex(Math.min(newIndex, rentProperties.length - 1));
    }
  }, [getCardTotalWidth, rentProperties.length]);

  // Scroll to specific index
  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const totalWidth = getCardTotalWidth();
      const scrollAmount = index * totalWidth;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  // Scroll left/right by one card
  const scroll = (direction) => {
    const totalWidth = getCardTotalWidth();
    const currentScroll = scrollRef.current.scrollLeft;
    let newScroll;
    if (direction === 'left') {
      newScroll = currentScroll - totalWidth;
    } else {
      newScroll = currentScroll + totalWidth;
    }
    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
  };

  // Set up scroll event listener and card width 
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      const handleScroll = () => {
        requestAnimationFrame(updateActiveIndex);
      };
      container.addEventListener('scroll', handleScroll);

      // Initial calculation
      const updateDimensions = () => {
        if (container) {
          // Force a small timeout to ensure layout is complete
          setTimeout(() => {
            updateActiveIndex();
          }, 100);
        }
      };
      updateDimensions();

      window.addEventListener('resize', updateDimensions);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, [rentProperties.length, updateActiveIndex]);

  return (
    <section className="dm-sans py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Recent Properties for <span className='text-indigo-600'>Rent</span></h2>

          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-500">Newly Listed Rental Properties</p>

            {/* View All NavLink */}
            <NavLink
              to="/rent"
              className="md:hidden flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors group"
            >
              View All
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </div>
        </div>

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="p-3 rounded-full border border-gray-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 rounded-full border border-gray-200 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <ChevronRight size={24} />
          </button>
        </div>


      </div>

      {/* Property Slider / Container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto gap-6 flex pb-8 no-scrollbar touch-pan-x snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {rentProperties.map((property, idx) => (
          <div
            onClick={() => navigate(`/property/${property._id}`)}
            key={idx}
            className="property-card min-w-[300px] md:min-w-[390px] flex-1 snap-start group"
          >
            {/* Card Content */}
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300">
              {/* Image Area */}
              <div className="relative h-56 overflow-hidden rounded-2xl">
                <img
                  src={cloudinaryUrl(property.images?.[0], { width: 400 })}

                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-200"
                  alt={property.title}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase tracking-wider"> Rent</span>
                  {property.featured && (
                    <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">Featured</span>
                  )}
                </div>
              </div>

              {/* Info Area */}
              <div className="py-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{property.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <MapPin size={14} className="text-gray-400" />
                  {property.address}, {property.city}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Bed size={16} className="text-gray-400" /> {property.beds}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Bath size={16} className="text-gray-400" /> {property.baths}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Maximize size={16} className="text-gray-400" /> {property.sqft}
                    </div>
                  </div>
                  <div className="text-rose-500 font-bold">
                    {property.price}<span className="text-[10px] text-gray-400 font-normal">/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-4">
        <div></div>
        
        {/* Dynamic Pagination Dots */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          {indexRentProperties.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`transition-all duratio-2000 rounded-full ${activeIndex === idx
                ? 'w-6 h-2 bg-gray-800'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`View All Property ${idx + 1}`}
            />
          ))}
        </div>

        {/* View All NavLink */}
        <div className='hidden md:block'>
          <NavLink
            to="/rent"
            className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors group"
          >
            View All Property
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedRent;