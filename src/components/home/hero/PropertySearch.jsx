import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, Search, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function PropertySearch({ onSearch, initialFilters = {} }) {
  const navigate = useNavigate();

  const [propertyType, setPropertyType] = useState(initialFilters.type || '');
  const [keyword, setKeyword] = useState(initialFilters.keyword || '');
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange || [0, 1000000]);
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const filterModalRef = useRef(null);

  useEffect(() => {
    let count = 0;
    if (propertyType) count++;
    if (bedrooms) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000000) count++;
    setActiveFilterCount(count);
  }, [propertyType, bedrooms, priceRange]);

  // close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterModalRef.current && !filterModalRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);

  const buildParams = () => ({
    type: propertyType || '',
    keyword: keyword.trim() || '',
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    bedrooms: bedrooms || '',
  });

  // navigate to / search with query params
  const handleSearch = () => {
    const p = buildParams();
    const params = new URLSearchParams();
    if (p.type) params.set('type', p.type);
    if (p.keyword) params.set('keyword', p.keyword);
    if (p.minPrice) params.set('minPrice', p.minPrice);
    if (p.maxPrice < 1000000) params.set('maxPrice', p.maxPrice);
    if (p.bedrooms) params.set('bedrooms', p.bedrooms);

    if (onSearch) {
      onSearch(p);
      return;
    }

    navigate(`/searched-list/${params.toString()}`);
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
    handleSearch();
  };

  const resetFilters = () => {
    setPropertyType('');
    setKeyword('');
    setPriceRange([0, 1000000]);
    setBedrooms('');
  };

  return (
    <div className="dm-sans">
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow border border-white/30 p-2 md:p-2.5 transition-all">
          <div className="flex flex-col md:flex-row md:items-center gap-2">

            {/* Property Type */}
            <div className="relative flex-1 md:w-1/5">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-white text-gray-800 rounded-xl border border-gray-200 pl-4 pr-10 py-3 text-sm font-medium cursor-pointer appearance-none outline-none transition-all hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Properties</option>
                <option value="apartment"> Apartment</option>
                <option value="villa"> Villa</option>
                <option value="condo"> Condo</option>
                <option value="land"> Land</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-200" />

            {/* Keyword */}
            <div className="flex-[2]">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by city, property name or ZIP..."
                className="w-full bg-white/80 text-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="flex gap-4">
              {/* Filter button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="relative flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100/80 rounded-xl hover:bg-gray-50 transition-all md:w-auto w-full"
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg md:w-auto w-full"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div
            ref={filterModalRef}
            className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Property Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['apartment', 'villa', 'condo', 'land'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setPropertyType(propertyType === type ? '' : type)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-all ${propertyType === type
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range:{' '}
                  <span className="text-indigo-600">${priceRange[0].toLocaleString()}</span>
                  {' '}–{' '}
                  <span className="text-indigo-600">${priceRange[1].toLocaleString()}</span>
                </label>
                <input
                  type="range" min="0" max="1000000" step="50000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, Math.max(+e.target.value, priceRange[1])])}
                  className="w-full accent-indigo-600"
                />
                <input
                  type="range" min="0" max="1000000" step="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([Math.min(priceRange[0], +e.target.value), +e.target.value])}
                  className="w-full accent-indigo-600 mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span><span>$250k</span><span>$500k</span><span>$750k</span><span>$1M+</span>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {['', '1', '2', '3', '4', '5+'].map((num) => (
                    <button
                      key={num}
                      onClick={() => setBedrooms(bedrooms === num ? '' : num)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${bedrooms === num
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {num === '' ? 'Any' : num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-100 p-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Reset all
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-md"
              >
                Apply {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}