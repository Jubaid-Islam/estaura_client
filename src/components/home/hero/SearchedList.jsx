import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, BedDouble, Bath, Maximize, MapPin, SearchX, Building2 } from 'lucide-react';
import PropertySearch from './PropertySearch';
import useProperties from '../../../hooks/property/useProperties';
import { cloudinaryUrl } from '../../../hooks/cloudniaryUrl';

const formatPrice = (value) => {
  if (!value && value !== 0) return 'Price on request';
  return `$${Number(value).toLocaleString()}`;
};

const SearchedList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [properties = [], isLoading, , isError] = useProperties();

  const filters = useMemo(() => {
    const params = new URLSearchParams(id || '');
    const minPrice = Number(params.get('minPrice')) || 0;
    const maxPrice = Number(params.get('maxPrice')) || 1000000;

    return {
      type: params.get('type') || '',
      keyword: params.get('keyword') || '',
      minPrice,
      maxPrice,
      bedrooms: params.get('bedrooms') || '',
    };
  }, [id]);

  const filteredProperties = useMemo(() => {
    const keyword = filters.keyword.toLowerCase();
    const bedrooms = filters.bedrooms;

    return (properties || []).filter((property) => {
      const type = String(property?.propertyType || '').toLowerCase();
      const title = String(property?.title || '').toLowerCase();
      const city = String(property?.city || property?.address || '').toLowerCase();
      const price = Number(property?.price || 0);
      const bedroomsValue = String(property?.bedrooms || '');

      const matchesType = !filters.type || type === filters.type;
      const matchesKeyword = !keyword || title.includes(keyword) || city.includes(keyword);
      const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
      const matchesBedrooms = !bedrooms
        ? true
        : bedrooms === '5+'
          ? Number(bedroomsValue) >= 5
          : bedroomsValue === bedrooms;

      return matchesType && matchesKeyword && matchesPrice && matchesBedrooms;
    });
  }, [filters, properties]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans mt-16">
        <div className="max-w-6xl mx-auto animate-pulse space-y-6">
          <div className="h-7 w-32 bg-gray-200 rounded-lg"></div>
          <div className="h-14 bg-white rounded-2xl border border-gray-100"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="h-44 bg-gray-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen dm-sans ">
      <div className="max-w-6xl mx-auto">

        {/* Back, count */}
        <div className="flex items-center justify-between mb-6 mt-25">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          {!isError && (
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-indigo-500">{filteredProperties.length}</span>{' '}
              {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </p>
          )}
        </div>

        {/* Search bar */}
        <div className="mb-8">
          <PropertySearch
            initialFilters={filters}
            onSearch={(searchFilters) => {
              const params = new URLSearchParams();
              if (searchFilters.type) params.set('type', searchFilters.type);
              if (searchFilters.keyword) params.set('keyword', searchFilters.keyword);
              if (searchFilters.priceRange?.[0]) params.set('minPrice', searchFilters.priceRange[0]);
              if (searchFilters.priceRange?.[1] < 1000000) params.set('maxPrice', searchFilters.priceRange[1]);
              if (searchFilters.bedrooms) params.set('bedrooms', searchFilters.bedrooms);
              navigate(`/searched-list/${params.toString()}`);
            }}
          />
        </div>

        {/* Results */}
        {isError ? (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm text-center py-20">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <SearchX size={24} className="text-red-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Something went wrong</p>
            <p className="text-xs text-gray-400 mt-1">Failed to load properties. Please try again.</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
            <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <SearchX size={24} className="text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-gray-700">No properties matched your search</p>
            <p className="text-xs text-gray-400 mt-1">Try a broader keyword or reset some filters.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-100"
            >
              Browse all listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map((property) => {
              const image = property?.images?.[0] || '';
              const title = property?.title || 'Property';
              const city = property?.city || property?.address || 'Location not specified';
              const type = property?.propertyType || 'property';
              const bedrooms = property?.bedrooms;
              const bathrooms = property?.bathrooms;
              const featured = property?.featured;
              const listingType = property?.listingType;
              const sqft = property?.sqft;

              return (
                <button
                  key={property?._id}
                  onClick={() => navigate(`/property/${property?._id}`)}
                  className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    {image ? (
                      <img
                        src={cloudinaryUrl(image, { width: 400 })}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={28} className="text-gray-300" />
                      </div>
                    )}


                    <div className="absolute top-4 left-4 flex gap-2">
                      {
                        listingType === 'buy' ? (

                          <span className="px-3 py-1 bg-emerald-700 text-white text-[10px] font-bold
                   rounded-md uppercase">
                            Buy
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md uppercase">
                            Rent
                          </span>

                        )
                      }

                      {featured && (
                        <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-md uppercase">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{title}</h3>
                      <span className="text-sm font-bold text-indigo-600 flex-shrink-0">
                        {formatPrice(property?.price)}
                      </span>
                    </div>

                    <p className="flex items-center gap-1 text-xs text-gray-400 mb-3 truncate">
                      <MapPin size={11} className="flex-shrink-0" /> {city}
                    </p>
                    <div className="flex justify-between">

                      <div className="flex items-center gap-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
                        {bedrooms !== undefined && (
                          <span className="flex items-center gap-1">
                            <BedDouble size={13} className="text-gray-400" /> {bedrooms}
                          </span>
                        )}
                        {bathrooms !== undefined && (
                          <span className="flex items-center gap-1">
                            <Bath size={13} className="text-gray-400" /> {bathrooms}
                          </span>
                        )}
                        {sqft !== undefined && (
                          <span className="flex items-center gap-1">
                            <Maximize size={13} className="text-gray-400" /> {Number(sqft).toLocaleString()} sqft
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-semibold uppercase tracking-wide text-indigo-600 rounded-full shadow-sm">
                          {type}
                        </span>
                      </div>

                    </div>

                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchedList;