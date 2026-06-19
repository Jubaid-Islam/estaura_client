import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Building2, Search, X, MapPin, Calendar, Maximize,
  ChevronLeft, ChevronRight, ArrowLeft, Clock, Eye,
  Trash2, Bed, Bath, CheckCircle, XCircle, ChevronDown,
  Tag,
  ScanEye,
  EllipsisVertical
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../../axios/useAxiosSecure';
import useAssignedProperties from '../../../../../hooks/property/useAssignedProperties';
import {
  updatePropertyStatus,
  updateDealStatus,
  deletePropertyByAgent,
} from '../../../../../api/PropertyApi';
import { cloudinaryUrl } from '../../../../../hooks/cloudniaryUrl';

const DEAL_STATUSES = [
  { value: 'interested', label: 'Interested', color: 'bg-gray-100/60 text-blue-700' },
  { value: 'visit_scheduled', label: 'Visit Scheduled', color: 'bg-gray-100/60 text-purple-700' },
  { value: 'negotiating', label: 'Negotiating', color: 'bg-gray-100/60 text-yellow-700' },
  { value: 'deal_closed', label: 'Deal Closed', color: 'bg-gray-100/60 text-emerald-700' },
];


const propertyListingTypeBadge = (listingType) => {
  const map = {
    rent: 'bg-gray-100/60 text-blue-700',
    buy: 'bg-gray-100/60 text-emerald-700',
  };
  return map[listingType] || 'bg-gray-100 text-gray-500';
};

const getDealStatus = (dealStatus) =>
  DEAL_STATUSES.find((d) => d.value === dealStatus) || null;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const AssignedProperties = () => {
  const axiosSecure = useAxiosSecure();

  const queryClient = useQueryClient();
  const [properties, isLoading] = useAssignedProperties();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [openDealDropdown, setOpenDealDropdown] = useState(null);
  const [openModalId, setOpenModalId] = useState(null);

  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return properties;
    return properties.filter((p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  // handlers 
  const handleMarkActive = async (id) => {
    const result = await Swal.fire({
      title: 'Mark as Active?',
      text: 'This property will be visible and active again.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, activate',
      customClass: { popup: 'rounded-2xl' },
    });
    if (!result.isConfirmed) return;
    try {
      await updatePropertyStatus(id, 'approved', axiosSecure);
      Swal.fire({ icon: 'success', title: 'Activated!', timer: 1500, showConfirmButton: false });
      setSelectedProperty(null);
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch {
      Swal.fire('Error', 'Failed to activate property.', 'error');
    }
  };

  const handleMarkClosed = async (id) => {
    const result = await Swal.fire({
      title: 'Close this Deal?',
      text: 'Property will be disabled and hidden from listings.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, close deal',
      customClass: { popup: 'rounded-2xl' },
    });
    if (!result.isConfirmed) return;
    try {
      await updatePropertyStatus(id, 'closed', axiosSecure);
      Swal.fire({ icon: 'success', title: 'Deal Closed!', timer: 1500, showConfirmButton: false });
      setSelectedProperty(null);
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch {
      Swal.fire('Error', 'Failed to close deal.', 'error');
    }
  };

  const handleDealStatus = async (id, dealStatus) => {
    try {
      await updateDealStatus(id, dealStatus, axiosSecure);
      setOpenDealDropdown(null);
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch {
      Swal.fire('Error', 'Failed to update deal status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Property?',
      text: 'This action cannot be undone. All images will also be removed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      customClass: { popup: 'rounded-2xl' },
    });
    if (!result.isConfirmed) return;
    try {
      await deletePropertyByAgent(id, axiosSecure);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
      setSelectedProperty(null);
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    } catch {
      Swal.fire('Error', 'Failed to delete property.', 'error');
    }
  };

  // loading 
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen dm-sans">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-56 bg-gray-200 rounded-lg" />
          <div className="h-4 w-72 bg-gray-100 rounded" />
          <div className="h-12 w-full bg-gray-200 rounded-xl" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
              <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div className='py-2'>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Assigned Properties :
            </h1>
            {filteredProperties.length > 0 && (
              <span className="px-2 py-1  text-indigo-600 md:text-2xl mt-1 text-xl  font-bold rounded-full flex items-center gap-1">
                {filteredProperties.length}
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm">Properties assigned to you — manage deals and status</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Desktop  */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {['Property', 'Date', 'Listing Type', 'Deal Status', 'View', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map((property) => (
                <tr
                  key={property._id}
                  className={`hover:bg-indigo-50/20 transition ${property.status === 'closed' ? 'opacity-60' : ''}`}
                >
                  {/* Property */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={cloudinaryUrl(property.images?.[0], { width: 150 })}
                          alt={property.title}
                          loading="lazy"
                          className={`w-full h-full object-cover ${property.status === 'closed' ? 'grayscale' : ''}`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1 text-sm">{property.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 py-0.5">
                          <MapPin size={11} /> {property.city}
                        </p>
                        <p className="text-sm font-bold text-indigo-600 mt-0.5">
                          ${Number(property.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar size={13} className="text-gray-400" />
                      {formatDate(property.createdAt)}
                    </div>
                  </td>

                  {/* Listing type */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 py-1 text-xs font-bold uppercase ${property.listingType === 'rent' ? 'text-blue-700' : 'text-emerald-700'
                      }`}>
                      <Tag size={12} />
                      {property.listingType === 'rent' ? 'Rent' : 'Sale'}
                    </span>
                  </td>


                  {/* Deal Status Dropdown */}
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDealDropdown(openDealDropdown === property._id ? null : property._id)}
                        disabled={property.status === 'closed'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${property.status === 'closed'
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : getDealStatus(property.dealStatus)
                            ? `${getDealStatus(property.dealStatus).color} border-transparent hover:opacity-80`
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                      >
                        {getDealStatus(property.dealStatus)?.label || 'Set Status'}
                        <ChevronDown size={12} />
                      </button>
                      {openDealDropdown === property._id && (
                        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                          {DEAL_STATUSES.map((s) => (
                            <button
                              key={s.value}
                              onClick={() => handleDealStatus(property._id, s.value)}
                              className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition ${property.dealStatus === s.value ? s.color : 'text-gray-700'
                                }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* View */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setSelectedProperty(property); setPreviewImageIndex(0); }}
                      className="p-2 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                      <ScanEye size={20} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {property.status === 'closed' ? (
                        <button
                          onClick={() => handleMarkActive(property._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition"
                        >
                          <CheckCircle size={13} /> Active
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkClosed(property._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-gray-50 hover:bg-red-600/80 hover:text-white rounded-lg text-xs font-semibold transition"
                        >
                          <XCircle size={13} /> Closed
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="p-1.5 border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile  */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredProperties.map((property) => (
            <div
              key={property._id}
              className={`p-4 hover:bg-gray-50 transition ${property.status === 'closed' ? 'opacity-60' : ''}`}
            >
              {/* Listing type + date */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${propertyListingTypeBadge(property.listingType)}`}>
                    {property.listingType}
                  </span>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">
                    ${Number(property.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={11} /> {formatDate(property.createdAt)}
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={cloudinaryUrl(property.images?.[0], { width: 150 })}
                    alt={property.title}
                    loading="lazy"
                    className={`w-full h-full object-cover ${property.status === 'closed' ? 'grayscale' : ''}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 line-clamp-1 text-sm">{property.title}</p>
                    <button
                      onClick={() => { setSelectedProperty(property); setPreviewImageIndex(0); }}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex-shrink-0"
                    >
                      <Eye size={15} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin size={11} /> {property.city}
                  </p>

                  {/* Mobile Deal Status */}
                  <div className="relative mt-2 flex items-center justify-between">
                    <button
                      onClick={() => setOpenDealDropdown(openDealDropdown === property._id ? null : property._id)}
                      disabled={property.status === 'closed'}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${property.status === 'closed'
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : getDealStatus(property.dealStatus)
                          ? `${getDealStatus(property.dealStatus).color} border-transparent`
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                    >
                      {getDealStatus(property.dealStatus)?.label || 'Set Deal Status'}
                      <ChevronDown size={11} />
                    </button>
                    {openDealDropdown === property._id && (
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                        {DEAL_STATUSES.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => handleDealStatus(property._id, s.value)}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 transition ${property.dealStatus === s.value ? s.color : 'text-gray-700'
                              }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Menu Button & Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenModalId(openModalId === property._id ? null : property._id)}
                        className="p-1 rounded-full hover:bg-gray-100 transition"
                      >
                        <EllipsisVertical size={14} className="text-gray-500" />
                      </button>

                      {/* closes menu when clicked outside */}
                      {openModalId === property._id && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenModalId(null)}
                        />
                      )}

                      {/* Dropdown Menu */}
                      {openModalId === property._id && (
                        <div
                          className="absolute right-5 bottom-0 w-32 bg-white rounded-xs shadow-lg border border-gray-100 z-20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            {property.status === 'closed' ? (
                              <button
                                onClick={() => {
                                  handleMarkActive(property._id);
                                  setOpenModalId(null);
                                }}
                                className="w-full text-left px-4 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                              >
                                <CheckCircle size={12} /> Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  handleMarkClosed(property._id);
                                  setOpenModalId(null);
                                }}
                                className="w-full text-left px-4 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <XCircle size={12} /> Close Deal
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleDelete(property._id);
                                setOpenModalId(null);
                              }}
                              className="w-full text-left px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No assigned properties</h3>
            <p className="text-gray-500 mt-1 text-sm">
              {searchTerm ? 'Try a different search term.' : 'Admin will assign properties to you.'}
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedProperty && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedProperty(null)}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Image */}
            <div className="relative bg-gray-100">
              <div className="h-72 md:h-96 overflow-hidden">
                <img
                  src={cloudinaryUrl(selectedProperty.images?.[previewImageIndex] || selectedProperty.images?.[0], { width: 1000 })}
                  alt={selectedProperty.title}
                  className={`w-full h-full object-cover transition-transform duration-300 ${selectedProperty.status === 'closed' ? 'grayscale' : ''}`}
                />
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition"
              >
                <X size={20} className="text-gray-700" />
              </button>
              {selectedProperty.images?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                    {selectedProperty.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPreviewImageIndex(idx)}
                        className={`w-10 h-10 rounded-md overflow-hidden border-2 transition ${previewImageIndex === idx ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                      >
                        <img src={cloudinaryUrl(img, { width: 80 })} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {selectedProperty.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setPreviewImageIndex((p) => (p > 0 ? p - 1 : selectedProperty.images.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setPreviewImageIndex((p) => (p < selectedProperty.images.length - 1 ? p + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${propertyListingTypeBadge(selectedProperty.listingType)}`}>
                    {selectedProperty.listingType}
                  </span>
                  {selectedProperty.dealStatus && getDealStatus(selectedProperty.dealStatus) && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getDealStatus(selectedProperty.dealStatus).color}`}>
                      {getDealStatus(selectedProperty.dealStatus).label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm">{selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-3xl font-bold text-indigo-600">${Number(selectedProperty.price).toLocaleString()}</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">
                  <Building2 size={12} /> {selectedProperty.propertyType}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                {[
                  { icon: <Bed size={18} className="text-indigo-500" />, label: 'Bedrooms', value: selectedProperty.bedrooms },
                  { icon: <Bath size={18} className="text-indigo-500" />, label: 'Bathrooms', value: selectedProperty.bathrooms },
                  { icon: <Maximize size={18} className="text-indigo-500" />, label: 'Area', value: `${Number(selectedProperty.sqft).toLocaleString()} sqft` },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-gray-700">
                    {s.icon}
                    <div>
                      <p className="text-xs text-gray-400">{s.label}</p>
                      <p className="font-semibold">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{selectedProperty.description}</p>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                {selectedProperty.status === 'closed' ? (
                  <button
                    onClick={() => handleMarkActive(selectedProperty._id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 rounded-xl text-sm font-semibold transition"
                  >
                    <CheckCircle size={15} /> Mark Active
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkClosed(selectedProperty._id)}
                    className="flex items-center gap-2 px-5 py-2.5 border border-red-100 text-red-600 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-sm font-semibold transition"
                  >
                    <XCircle size={15} /> Close Deal
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedProperty._id)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-xl text-sm font-semibold transition ml-auto"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedProperties;