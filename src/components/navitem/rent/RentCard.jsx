import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Maximize, ArrowRight, Loader2, Search,
  SlidersHorizontal, X, Filter, Home, Building2, LandPlot,
} from 'lucide-react';
import useProperties from '../../../hooks/property/useProperties';
import { cloudinaryUrl } from '../../../hooks/cloudniaryUrl';
import CardSkeleton from '../../loading/CardSkeleton';

const RentCard = () => {
  const [properties, isLoading, , isError] = useProperties();
  const navigate = useNavigate()

  // Filter states 
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // filter 
  const rentProperties = useMemo(() => {
    return properties?.filter(
      p => p.listingType === 'rent'
    ) || [];
  }, [properties]);

  // Apply filters
  const filteredProperties = useMemo(() => {
    return rentProperties.filter(property => {
      // Search term
      const searchMatch = searchTerm.trim() === '' ||
        property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchTerm.toLowerCase());

      // Price range
      const price = property.price;
      const minMatch = price >= priceMin;
      const maxMatch = price <= priceMax;

      // Bedrooms
      const bedMatch = bedrooms === '' || property.bedrooms.parseInt === (bedrooms);
      // Bathrooms
      const bathMatch = bathrooms === '' || property.bathrooms.parseInt === (bathrooms);
      // Property type
      const typeMatch = propertyType === '' || property.propertyType === propertyType;

      return searchMatch && minMatch && maxMatch && bedMatch && bathMatch && typeMatch;
    });
  }, [rentProperties, searchTerm, priceMin, priceMax, bedrooms, bathrooms, propertyType]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm.trim()) count++;
    if (priceMin > 0 || priceMax < 1000000) count++;
    if (bedrooms) count++;
    if (bathrooms) count++;
    if (propertyType) count++;
    return count;
  }, [searchTerm, priceMin, priceMax, bedrooms, bathrooms, propertyType]);

  const resetFilters = () => {
    setSearchTerm('');
    setPriceMin(0);
    setPriceMax(1000000);
    setBedrooms('');
    setBathrooms('');
    setPropertyType('');
  };

  // Format price labels
  const formatPrice = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  // Remove a specific filter
  const removeFilter = (filterName) => {
    switch (filterName) {
      case 'search': setSearchTerm(''); break;
      case 'price': setPriceMin(0); setPriceMax(1000000); break;
      case 'bedrooms': setBedrooms(''); break;
      case 'bathrooms': setBathrooms(''); break;
      case 'propertyType': setPropertyType(''); break;
      default: break;
    }
  };

  // Loading 

  if (isLoading) {
    return (
      <CardSkeleton />
    )
  }
  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-lg">Failed to load properties. Please try again later.</p>
      </div>
    );
  }

  if (rentProperties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">No rental properties available at the moment.</p>
      </div>
    );
  }

  // Filter Controls renderer
  const renderFilterControls = ({ className = "" }) => (
    <div className={className}>

      {/* Search Input */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Title, address or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>
      </div>

      {/* Property Type - Chips */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'apartment', label: 'Apartment', icon: <Building2 size={14} /> },
            { value: 'villa', label: 'Villa', icon: <Home size={14} /> },
            { value: 'condo', label: 'Condo', icon: <Building2 size={14} /> },
            { value: 'land', label: 'Land', icon: <LandPlot size={14} /> }
          ].map(type => (
            <button
              key={type.value}
              onClick={() => setPropertyType(propertyType === type.value ? '' : type.value)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${propertyType === type.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range - Dual Range Sliders */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range: <span className="text-indigo-600">{formatPrice(priceMin)}</span> – <span className="text-indigo-600">{formatPrice(priceMax)}</span>
        </label>
        <div className="space-y-4">
          <div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={50000}
              value={priceMin}
              onChange={(e) => setPriceMin(Math.min(parseInt(e.target.value), priceMax - 50000))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>$250k</span>
              <span>$500k</span>
              <span>$750k</span>
              <span>$1M</span>
            </div>
          </div>
          <div>
            <input
              type="range"
              min={0}
              max={1000000}
              step={50000}
              value={priceMax}
              onChange={(e) => setPriceMax(Math.max(parseInt(e.target.value), priceMin + 50000))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-3 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          >
            <option value="">Any</option>
            <option value="1">1 Bed</option>
            <option value="2">2 Beds</option>
            <option value="3">3 Beds</option>
            <option value="4">4+ Beds</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
          <select
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          >
            <option value="">Any</option>
            <option value="1">1 Bath</option>
            <option value="2">2 Baths</option>
            <option value="3">3+ Baths</option>
          </select>
        </div>
      </div>

    </div>
  );

  return (
    <section className="dm-sans py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Properties for <span className="text-indigo-600">Rent</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Discover your perfect home from our latest rental listings
          </p>
        </div>
        {/* Mobile filter icon */}
        <div className='flex justify-end py-6'>
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative md:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            <Filter size={18} />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8 transition-all">
        {renderFilterControls({ onReset: resetFilters, className: "grid grid-cols-1 md:grid-cols-4 gap-5 items-start" })}

        {/* Active Filters Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs">
                Search: {searchTerm}
                <button onClick={() => removeFilter('search')} className="ml-1 hover:text-red-500"><X size={12} /></button>
              </span>
            )}
            {(priceMin > 0 || priceMax < 1000000) && (
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs">
                Price: {formatPrice(priceMin)} - {formatPrice(priceMax)}
                <button onClick={() => removeFilter('price')} className="ml-1 hover:text-red-500"><X size={12} /></button>
              </span>
            )}
            {bedrooms && (
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs">
                {bedrooms === '4' ? '4+ Beds' : `${bedrooms} Bed${bedrooms !== '1' ? 's' : ''}`}
                <button onClick={() => removeFilter('bedrooms')} className="ml-1 hover:text-red-500"><X size={12} /></button>
              </span>
            )}
            {bathrooms && (
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs">
                {bathrooms === '3' ? '3+ Baths' : `${bathrooms} Bath${bathrooms !== '1' ? 's' : ''}`}
                <button onClick={() => removeFilter('bathrooms')} className="ml-1 hover:text-red-500"><X size={12} /></button>
              </span>
            )}
            {propertyType && (
              <span className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs capitalize">
                {propertyType}
                <button onClick={() => removeFilter('propertyType')} className="ml-1 hover:text-red-500"><X size={12} /></button>
              </span>
            )}
            <button onClick={resetFilters} className="text-xs bg-indigo-200 px-3 py-1 rounded-xl  text-indigo-600 hover:underline ml-2">Clear all</button>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
          <SlidersHorizontal size={14} />
          <span>{filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found</span>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Filter Properties</h3>
                {activeFilterCount > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {renderFilterControls({ onReset: resetFilters, className: "flex flex-col gap-5" })}
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setIsModalOpen(false);
                }}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Reset & Close
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
              >
                Show {filteredProperties.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 text-lg">No properties match your filters.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-indigo-600 font-medium hover:underline inline-flex items-center gap-1"
          >
            Reset filters <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              onClick={() => navigate(`/property/${property._id}`)}
              key={property._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={cloudinaryUrl(property.images?.[0], { width: 400 })}
          
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-200"
                  alt={property.title}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase">
                    Rent
                  </span>
                  {property.featured && (
                    <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-md uppercase">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="py-5 px-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{property.address}, {property.city}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Bed size={16} className="text-gray-400" /> {property.bedrooms}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Bath size={16} className="text-gray-400" /> {property.bathrooms}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Maximize size={16} className="text-gray-400" /> {property.sqft}
                    </div>
                  </div>
                  <div className="text-rose-500 font-bold text-lg">
                    ${property.price}
                    <span className="text-xs text-gray-400 font-normal">/month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};

export default RentCard;