import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Pause, Play } from 'lucide-react';

const CustomerReview = () => {
  const scrollRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAutoSliding = true;
  const [hovered, setHovered] = useState(false);

  // Sample review data
  const reviews = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      location: 'New York, NY',
      rating: 5,
      text: 'Absolutely amazing experience! The agent helped me find my dream home in just two weeks. Highly recommend!',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      verified: true,
    },
    {
      id: 2,
      name: 'David Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      text: 'Professional, responsive, and transparent. Sold my condo above asking price. Thank you!',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      verified: true,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Miami, FL',
      rating: 4,
      text: 'Great platform! Found a tenant for my rental property within days. Will use again.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      verified: true,
    },
    {
      id: 4,
      name: 'Michael Thompson',
      location: 'Chicago, IL',
      rating: 5,
      text: 'Smooth process from listing to closing. The team guided me every step of the way.',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      verified: false,
    },
    {
      id: 5,
      name: 'Jessica Lee',
      location: 'Austin, TX',
      rating: 5,
      text: 'Loved the virtual tour feature! Found my apartment without leaving my couch. Fantastic!',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      verified: true,
    },
    {
      id: 6,
      name: 'Robert King',
      location: 'Seattle, WA',
      rating: 4,
      text: 'Good selection of properties. Customer support was very helpful.',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      verified: true,
    },
  ];

  const indexReviews = reviews.slice(0, reviews.length - 2)


  // Calculate card width
  const getCardTotalWidth = useCallback(() => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('.review-card');
      if (firstCard) {
        const cardWidth = firstCard.clientWidth;
        const gap = 24; // gap-6
        return cardWidth + gap;
      }
    }
    // fallback values based on screen size
    if (window.innerWidth >= 1024) return (380 + 24);
    if (window.innerWidth >= 768) return (340 + 24);
    return (280 + 24);
  }, []);

  // Update active index based on scroll position
  const updateActiveIndex = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const totalWidth = getCardTotalWidth();
      const newIndex = Math.round(scrollLeft / totalWidth);
      setActiveIndex(Math.min(newIndex, reviews.length - 1));
    }
  }, [getCardTotalWidth, reviews.length]);

  // Scroll to specific index
  const scrollToIndex = useCallback((index) => {
    if (scrollRef.current) {
      const totalWidth = getCardTotalWidth();
      const scrollAmount = index * totalWidth;
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  }, [getCardTotalWidth]);

  // Scroll left / right by one card
  const scroll = useCallback((direction) => {
    if (scrollRef.current) {
      const totalWidth = getCardTotalWidth();
      const newLeft = direction === 'left'
        ? scrollRef.current.scrollLeft - totalWidth
        : scrollRef.current.scrollLeft + totalWidth;
      scrollRef.current.scrollTo({ left: newLeft, behavior: 'smooth' });
    }
  }, [getCardTotalWidth]);

  // Auto slide logic
  const startAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
    if (!isAutoSliding) return;
    autoSlideIntervalRef.current = setInterval(() => {
      if (!hovered && !isDragging) {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= reviews.length) nextIndex = 0;
        scrollToIndex(nextIndex);
      }
    }, 2000); // 5 seconds
  }, [activeIndex, hovered, isDragging, isAutoSliding, scrollToIndex, reviews.length]);

  const stopAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  }, []);


  // Drag to scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftStart(scrollRef.current.scrollLeft);
    stopAutoSlide();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    updateActiveIndex();
    startAutoSlide();
  };

  // Mouse enter / leave for hover pause
  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  // Recalculate card width on resize and update active index
  useEffect(() => {
    const handleResize = () => {
      updateActiveIndex();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateActiveIndex]);

  // Auto slide effect
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  // Listen to scroll events for index update
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateActiveIndex);
      return () => container.removeEventListener('scroll', updateActiveIndex);
    }
  }, [updateActiveIndex]);

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section id='customer-review' className="dm-sans py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header with auto slide toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 max-w-2xl">
              Real stories from happy home buyers and sellers
            </p>
          </div>
        </div>

        {/* Slider Container */}
        <div
          className="relative group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:block">
            <button
              onClick={() => { scroll('left'); stopAutoSlide(); startAutoSlide(); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
              disabled={activeIndex === 0}
              aria-label="Previous"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={() => { scroll('right'); stopAutoSlide(); startAutoSlide(); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
              disabled={activeIndex === reviews.length - 1}
              aria-label="Next"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Horizontal Scroll Area – responsive card widths */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="review-card flex-shrink-0 w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Quote Icon */}
                <Quote size={32} className="text-indigo-200 mb-4" />

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-5 line-clamp-4">
                  {review.text}
                </p>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(review.rating)}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                    loading="lazy"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800">{review.name}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots , Auto-slide indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {indexReviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { scrollToIndex(idx); stopAutoSlide(); startAutoSlide(); }}
              className={`transition-all duration-300 rounded-full ${activeIndex === idx
                  ? 'w-6 h-2 bg-indigo-600'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default CustomerReview;