import React, { useState, useMemo, useCallback } from 'react';
import {
  Trash2, UserPlus, Calendar, Tag,
  Building2, Search,
  SquarePen, X, UserCheck,
  MapPin, Plus, Clock, ClipboardClock,
  RotateCw,
  ChevronDown,
} from 'lucide-react';
import Swal from 'sweetalert2';
import useProperties from '../../../../../hooks/property/useProperties';
import { deleteProperty } from '../../../../../api/PropertyApi';
import { useNavigate } from 'react-router';
import useAssignAgent from '../../../../../hooks/property/useAssignAgent';
import usePendingProperties from '../../../../../hooks/property/usePendingProperties';
import useAllAgents from '../../../../../hooks/user/useAllAgents';
import useAxiosSecure from '../../../../../axios/useAxiosSecure';
import { cloudinaryUrl } from '../../../../../hooks/cloudniaryUrl';
import { useQueryClient } from '@tanstack/react-query';

//  Deal status config 
const DEAL_STATUS_MAP = {
  interested: { label: 'Interested', color: 'bg-gray-50 text-blue-700' },
  visit_scheduled: { label: 'Visit Scheduled', color: 'bg-gray-50 text-purple-700' },
  negotiating: { label: 'Negotiating', color: 'bg-gray-50 text-yellow-700' },
  deal_closed: { label: 'Deal Closed', color: 'bg-gray-50 text-emerald-700' },
};

const DealStatusBadge = ({ dealStatus }) => {
  const config = DEAL_STATUS_MAP[dealStatus];
  if (!config) return null;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const PropertyList = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [properties, isLoading, refetch] = useProperties();
  const { mutateAsync } = useAssignAgent();
  const [agents] = useAllAgents();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [listingFilter, setListingFilter] = useState('all');
  const [pendingProperties] = usePendingProperties();
  const pendingCount = pendingProperties?.length || 0;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ["properties"] }),
        queryClient.invalidateQueries({ queryKey: ["pendingProperties"] }),
        queryClient.invalidateQueries({ queryKey: ["assignedProperties"] }),
      ]);
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const agentMap = useMemo(() => {
    if (!agents) return {};
    return agents.reduce((acc, agent) => {
      acc[agent._id] = agent.name;
      return acc;
    }, {});
  }, [agents]);

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter(p => {
      const matchSearch = !searchTerm.trim() ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.propertyType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchListing = listingFilter === 'all' || p.listingType === listingFilter;
      return matchSearch && matchListing;
    });
  }, [properties, searchTerm, listingFilter]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Property?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
      customClass: { popup: 'rounded-2xl' }
    });
    if (result.isConfirmed) {
      try {
        const res = await deleteProperty(id, axiosSecure);
        if (res.deletedCount > 0) {
          Swal.fire({ title: "Deleted!", icon: "success", showConfirmButton: false, timer: 1500 });
          queryClient.invalidateQueries({ queryKey: ["properties"] });
          queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
          queryClient.invalidateQueries({ queryKey: ["pendingProperties"] });
        }
      } catch {
        Swal.fire("Error", "Could not delete property.", "error");
      }
    }
  };

  const openAgentModal = (property) => {
    setSelectedProperty(property);
    setSelectedAgentId(property.agentId?.toString() || '');
    setIsAgentModalOpen(true);
  };

  const handleAssignAgent = async () => {
    if (!selectedProperty || !selectedAgentId) {
      Swal.fire("Error", "Please select an agent", "error");
      return;
    }
    try {
      await mutateAsync({ propertyId: selectedProperty._id, agentId: selectedAgentId });
      Swal.fire({ icon: "success", title: "Agent Assigned", timer: 1200, showConfirmButton: false });
      setIsAgentModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["assignedProperties"] });
    } catch {
      Swal.fire("Error", "Failed to assign agent", "error");
    }
  };

  const getAgentName = useCallback((agentId) => {
    if (!agentId) return <span className='text-red-500'>Unassigned</span>;
    return agentMap[agentId?.toString()] || "Unknown";
  }, [agentMap]);

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div>
          <div className="hidden md:flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Property Management
            </h1>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-indigo-600 rounded-xl transition shadow-sm disabled:opacity-50 flex items-center justify-center"
              title="Refresh list"
            >
              <RotateCw size={18} className={`${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
          <p className="text-gray-500 mt-1">Manage all your real estate listings.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title, city or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-11 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center  ml-auto sm:ml-0 gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          {['all', 'rent', 'buy'].map(type => (
            <button
              key={type}
              onClick={() => setListingFilter(type)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${listingFilter === type ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {type === 'all' ? 'All' : type === 'rent' ? 'Rent' : 'Buy'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/pending-properties')}
            className="relative flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-md"
          >
            <ClipboardClock size={16} />
            Pending
            {pendingCount > 0 && (
              <span className="bg-red-600/90 absolute -right-1 -top-1.5 text-gray-50 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/dashboard/add-property')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition shadow-md"
          >
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {['Property', 'Listing', 'Deal Status', 'Listed Date', 'Agents', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map((property) => (
                <tr key={property._id} className="hover:bg-indigo-50/20 transition group">

                  {/* Property */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        <img
                          src={cloudinaryUrl(property.images?.[0], { width: 300 })}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          alt={property.title}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-black line-clamp-1">{property.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Building2 size={12} /> {property.propertyType || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Listing type */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 py-1 text-xs font-bold uppercase ${property.listingType === 'rent' ? 'text-blue-700' : 'text-emerald-700'
                      }`}>
                      <Tag size={12} />
                      {property.listingType === 'rent' ? 'Rent' : 'Buy'}
                    </span>
                  </td>

                  {/* Deal Status  */}
                  <td className="px-6 py-4">
                    <DealStatusBadge dealStatus={property.dealStatus} />
                    {!property.dealStatus && (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      {formatRelativeDate(property.createdAt)}
                    </div>
                  </td>

                  {/* Assigned Agent */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openAgentModal(property)}
                      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-indigo-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
                      title="Assign agent"
                    >
                      <span className=" text-xs font-semibold text-indigo-600">{getAgentName(property.agentId)}</span>
                      <ChevronDown size={12} className="text-indigo-600 flex items-center" />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/property/edit-property/${property._id}`)}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <SquarePen size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredProperties.map((property) => (
            <div key={property._id} className="px-4 py-3.5 hover:bg-gray-50 transition-colors">

              {/* Top row — listing type and price | edit and delete */}
              <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${property.listingType === 'rent'
                      ? 'bg-gray-50 text-blue-700'
                      : 'bg-gray-50 text-teal-700'
                    }`}>
                    {property.listingType === 'rent' ? 'Rent' : 'Sale'}
                  </span>

                  {property.dealStatus && (
                    <div>
                      <DealStatusBadge dealStatus={property.dealStatus} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/property/edit-property/${property._id}`)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                  >
                    <SquarePen size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Bottom row — image and info */}
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={cloudinaryUrl(property.images?.[0], { width: 120 })}
                    className="w-full h-full object-cover"
                    alt={property.title}
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 truncate">{property.title}</p>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5 mb-0.5">
                    <MapPin size={10} /> {property.city}
                  </p>


                    <button
                      onClick={() => openAgentModal(property)}
                      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-indigo-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
                      title="Assign agent"
                    >
                      <span className=" text-xs font-semibold text-indigo-600">{getAgentName(property.agentId)}</span>
                      <ChevronDown size={12} className="text-indigo-600 flex items-center" />
                    </button>
                </div>
              </div>

            </div>
          ))}
        </div>
        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No properties found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or add a new property.</p>
          </div>
        )}
      </div>

      {/* Assign Agent Modal */}
      {isAgentModalOpen && selectedProperty && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setIsAgentModalOpen(false)}
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center p-5">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-600" /> Assign Agent
              </h3>
              <button onClick={() => setIsAgentModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700">{selectedProperty.title}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Choose an agent...</option>
                  {agents?.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-5 rounded-b-2xl">
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignAgent}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-md"
              >
                Assign Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;