import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react';
import useProperties from '../../../hooks/property/useProperties';
import { cloudinaryUrl } from '../../../hooks/cloudniaryUrl';

const FeaturedBuy = () => {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [properties] = useProperties();
  const navigate = useNavigate()

  // filter 
  const buyProperties = properties?.filter(p => p.listingType === 'buy')
    .slice(0, 8) || [];

  const indexBuyProperties = buyProperties.slice(0, buyProperties.length - 2);



  // Function to calculate card width 
  const getCardTotalWidth = useCallback(() => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('.property-card');
      if (firstCard) {
        const cardWidthValue = firstCard.clientWidth;
        const gap = 24;  // gap-6
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
      setActiveIndex(Math.min(newIndex, buyProperties.length - 1));
    }
  }, [getCardTotalWidth, buyProperties.length]);

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

  // Scroll left / right by one card
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

  // Set up scroll event listener and card width recalculation
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
  }, [buyProperties.length, updateActiveIndex]);

  return (
    <section className="dm-sans py-10 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 text-left">
          <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-2">Find your next home to <span className='text-indigo-600'>Buy</span></h2>

          <div className="flex items-center justify-between mt-4">
            <p className="text-gray-500 text-xs md:text-xl">Latest Properties Available for Sale</p>

            {/* View All NavLink */}
            <NavLink
              to="/buy"
              className="md:hidden flex items-center gap-2 text-xs font-bold text-gray-800 hover:text-indigo-600 transition-colors group"
            >
              View All
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
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

      <div
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden flex gap-6 pb-8 no-scrollbar snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >

        {buyProperties.map((property, idx) => (
          <div
            onClick={() => navigate(`/property/${property._id}`)}
            key={idx}
            className="property-card min-w-[200px] md:min-w-[390px] flex-1 snap-start group"
          >

            {/* Card Content */}
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300">
              {/* Image Area */}
              <div className="relative h-35 md:h-56  overflow-hidden">
                <img
                  src={cloudinaryUrl(property.images?.[0], { width: 400 })}
                  // loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-200"
                  alt={property.title}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-700 text-white text-[8px] md:text-[10px] font-bold rounded-md uppercase tracking-wider"> Buy</span>

                  {property.dealStatus === "deal_closed" && (
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-700/90 text-white text-[8px] md:text-[10px] font-bold rounded-md uppercase tracking-wider">Closed</span>
                  )}
                  {property.dealStatus === "negotiating" &&(
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-yellow-600 text-white text-[8px] md:text-[10px] font-bold rounded-md uppercase tracking-wider"> Negotiation</span>
                  )}

                </div>
              </div>

              {/* Info Area */}
              <div className="py-4 px-2">
                <h3 className="md:text-lg text-xs font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{property.title}</h3>
                <div className="flex items-center gap-1 text-gray-500 text-[8px] md:text-sm mb-4">
                  <MapPin size={8} className="text-gray-400" />
                  {property.address}, {property.city}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium">
                      <Bed size={16} className="text-gray-400" /> {property.bedrooms}
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-xs font-medium">
                      <Bath size={16} className="text-gray-400" /> {property.bathrooms}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium">
                      <Maximize size={16} className="text-gray-400" /> {property.sqft}
                    </div>
                  </div>
                  <div className="text-indigo-600 font-bold text-[12px]">
                    {property.price}<span className="text-[10px] text-gray-400 font-normal"> /month</span>
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
          {indexBuyProperties.map((property, idx) => (
            <button
              key={property._id}
              onClick={() => scrollToIndex(idx)}
              className={`transition-all duratio-2000 rounded-full ${activeIndex === idx
                ? 'w-6 h-2 bg-gray-800'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to property ${idx + 1}`}
            />
          ))}
        </div>

        {/* View All NavLink */}
        <div className='hidden md:block'>
          <NavLink
            to="/buy"
            className="flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors group"
          >
            View All Property
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
     
        .no-scrollbar {
         scrollbar-width: none;
         -ms-overflow-style: none;
         overflow: -moz-scrollbars-none;
        }

      .no-scrollbar::-webkit-scrollbar {
       width: 0 !important;    
       height: 0 !important;
       display: none !important;
      background: transparent;
       }
      `}</style>
    </section>
  );
};

export default FeaturedBuy;