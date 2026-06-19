import React, { useState, useMemo } from 'react';
import {
  Building2, Search, X, CheckCircle, XCircle,
  MapPin, Bed, Bath, Calendar, Maximize,
  ChevronLeft, ChevronRight, ArrowLeft, Eye,
  ScanEye
} from 'lucide-react';
import Swal from 'sweetalert2';
import usePendingProperties from '../../../../../hooks/property/usePendingProperties';
import { approveProperty, rejectProperty } from '../../../../../api/PropertyApi';
import useAxiosSecure from '../../../../../axios/useAxiosSecure';
import { cloudinaryUrl } from '../../../../../hooks/cloudniaryUrl';

import { useQueryClient } from '@tanstack/react-query';
import { NavLink } from 'react-router';

const formatDate = (d) => {
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const getInitial = (name) => name?.charAt(0).toUpperCase() || '?';

const AVATAR_COLORS = [
  'bg-indigo-50 text-indigo-800',
  'bg-blue-50 text-blue-800',
  'bg-teal-50 text-teal-800',
  'bg-amber-50 text-amber-800',
];
const getAvatarColor = (name = '') =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const Avatar = ({ user, size = 'sm' }) => {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return user?.photo ? (
    <img src={user.photo} className={`${dim} rounded-full object-cover flex-shrink-0`} alt="" />
  ) : (
    <div className={`${dim} rounded-full flex items-center justify-center font-medium flex-shrink-0 ${getAvatarColor(user?.name)}`}>
      {getInitial(user?.name)}
    </div>
  );
};

const PendingProperties = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [properties, isLoading] = usePendingProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);


  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    if (!searchTerm.trim()) return properties;
    return properties.filter(p =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.submittedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve property?',
      text: 'This property will be visible to all users.',
      showCancelButton: true,
      confirmButtonColor: '#534AB7',
      cancelButtonColor: '#D3D1C7',
      confirmButtonText: 'Yes, approve',
    });
    if (result.isConfirmed) {
      try {
        await approveProperty(id, axiosSecure);
        Swal.fire({ icon: 'success', timer: 1500, showConfirmButton: false });
        setSelectedProperty(null);
        queryClient.invalidateQueries({ queryKey: ['pendingProperties'] });
        queryClient.invalidateQueries({ queryKey: ['properties'] });
      } catch {
        Swal.fire('Error', 'Failed to approve property.', 'error');
      }
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject property?',
      text: 'This property will be marked as rejected.',
      showCancelButton: true,
      confirmButtonColor: '#E24B4A',
      cancelButtonColor: '#D3D1C7',
      confirmButtonText: 'Yes, reject',
    });
    if (result.isConfirmed) {
      try {
        await rejectProperty(id, axiosSecure);
        Swal.fire({ icon: 'success', timer: 1500, showConfirmButton: false });
        setSelectedProperty(null);
        queryClient.invalidateQueries({ queryKey: ['pendingProperties'] });
        queryClient.invalidateQueries({ queryKey: ['properties'] });
      } catch {
        Swal.fire('Error', 'Failed to reject property.', 'error');
      }
    }
  };

  if (isLoading) return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-8 w-52 bg-gray-100 rounded-lg" />
      <div className="h-10 w-full bg-gray-100 rounded-xl" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <NavLink
         to="/dashboard/property-list"
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-700 transition group mb-6"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
         Go Back
        </NavLink>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className='py-2'>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Pending Properties :
              </h1>
              {filteredProperties.length > 0 && (
                <span className="px- py-1  text-indigo-600 md:text-2xl mt-1 text-xl  font-bold rounded-full flex items-center gap-1">
                  {filteredProperties.length}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">Review and approve submitted listings</p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by title, city or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          {/* Desktop thead */}
          <div className="hidden md:grid grid-cols-[1fr_1.5fr_120px_92px_140px] px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            {['Submitted by', 'Property', 'Date', 'View', 'Actions'].map((h, i) => (
              <span key={i} className='text-[11px] uppercase tracking-wider text-gray-400 font-medium  '>
                {h}
              </span>
            ))}
          </div>

          {/* Empty state */}
          {filteredProperties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                <Building2 size={18} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No pending properties</p>
              <p className="text-xs text-gray-400">All submissions have been reviewed.</p>
            </div>
          )}

          {/* Desktop rows */}
          {filteredProperties.map((property, i) => (
            <React.Fragment key={property._id}>

              {/* Desktop */}
              <div className={`hidden md:grid grid-cols-[1fr_1.4fr_120px_92px_140px] items-center px-4 py-4 hover:bg-gray-50 transition-colors ${i < filteredProperties.length - 1 ? 'border-b border-gray-100' : ''}`}>

                {/* Submitted by */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar user={property.submittedBy} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{property.submittedBy?.name || 'Unknown'}</p>
                    <p className="text-[11px] text-gray-400 truncate">{property.submittedBy?.email || '—'}</p>
                  </div>
                </div>

                {/* Property */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={cloudinaryUrl(property.images?.[0], { width: 80 })} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{property.title}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin size={10} /> {property.city}
                    </p>

                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 text-[12px] text-gray-400">
                  <Calendar size={11} /> {formatDate(property.createdAt)}
                </div>

                {/* Preview */}
                <div>
                  <button
                    onClick={() => { setSelectedProperty(property); setPreviewImageIndex(0); }}
                    className="w-7 h-7 flex items-center justify-center text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Preview"
                  >
                  <ScanEye size={20} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleApprove(property._id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-medium hover:bg-indigo-700 transition-colors"
                  >
                    <CheckCircle size={12} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(property._id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-indigo-700 text-[11px] font-medium hover:bg-gray-100 transition-colors"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>

              {/* Mobile */}
              <div className={`md:hidden p-4 hover:bg-gray-50 transition-colors ${i < filteredProperties.length - 1 ? 'border-b border-gray-200/90' : ''}`}>

                {/* Top — submitter and date */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Avatar user={property.submittedBy} size="sm" />
                    <div>
                      <p className="text-[12px] font-medium text-gray-800">{property.submittedBy?.name || 'Unknown'}</p>
                      <p className="text-[11px] text-gray-400">{property.submittedBy?.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {formatDate(property.createdAt)}
                  </span>
                </div>

                {/* Bottom — image, info */}
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                    <img src={cloudinaryUrl(property.images?.[0], { width: 120 })} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{property.title}</p>
                      <button
                        onClick={() => { setSelectedProperty(property); setPreviewImageIndex(0); }}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex-shrink-0"
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {property.city}
                    </p>
               
                    <div className="flex gap-2 mt-2.5">
                      <button
                        onClick={() => handleApprove(property._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-indigo-600 text-white  text-[11px] font-medium"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(property._id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg bg-gray-50 border border-gray-200 text-indigo-600 text-[11px] font-medium"
                      >
                        <XCircle size={12} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedProperty && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setSelectedProperty(null)}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">

            {/* Image */}
            <div className="relative bg-gray-100">
              <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img
                  src={cloudinaryUrl(selectedProperty.images?.[previewImageIndex] || selectedProperty.images?.[0], { width: 900 })}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Close */}
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <X size={14} />
              </button>

              {/* Arrows */}
              {selectedProperty.images?.length > 1 && (
                <>
                  <button
                    onClick={() => setPreviewImageIndex(p => p > 0 ? p - 1 : selectedProperty.images.length - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPreviewImageIndex(p => p < selectedProperty.images.length - 1 ? p + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </>
              )}

              {/* Dot indicators */}
              {selectedProperty.images?.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {selectedProperty.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPreviewImageIndex(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === previewImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">

              {/* Title and address */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-base font-medium text-gray-900">{selectedProperty.title}</h3>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 capitalize whitespace-nowrap flex-shrink-0">
                    {selectedProperty.propertyType}
                  </span>
                </div>
                <p className="text-[12px] text-gray-400 flex items-center gap-1">
                  <MapPin size={11} />
                  {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
                </p>
              </div>

              {/* Price */}
              <p className="text-2xl font-medium text-indigo-700">${Number(selectedProperty.price).toLocaleString()}</p>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100">
                {[
                  { icon: <Bed size={15} className="text-indigo-600" />, label: 'Bedrooms', value: selectedProperty.bedrooms },
                  { icon: <Bath size={15} className="text-indigo-600" />, label: 'Bathrooms', value: selectedProperty.bathrooms },
                  { icon: <Maximize size={15} className="text-indigo-600" />, label: 'Area', value: `${Number(selectedProperty.sqft).toLocaleString()} sqft` },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-2">
                    {s.icon}
                    <div>
                      <p className="text-[10px] text-gray-400">{s.label}</p>
                      <p className="text-[13px] font-medium text-gray-800">{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">Description</p>
                <p className="text-[13px] text-gray-600 leading-relaxed">{selectedProperty.description}</p>
              </div>

              {/* Submitted by */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
                <Avatar user={selectedProperty.submittedBy} size="md" />
                <div>
                  <p className="text-[13px] font-medium text-gray-800">{selectedProperty.submittedBy?.name || 'Unknown'}</p>
                  <p className="text-[11px] text-gray-400">{selectedProperty.submittedBy?.email}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingProperties;