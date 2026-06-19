// AgentList.jsx
import React, { useState, useMemo } from 'react';
import {
  Search, X, Eye, UserCheck, MapPin,
  Briefcase, Calendar, Mail, Phone,
  FileText, Building2, Clock, ChevronRight,
  Trash2
} from 'lucide-react';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router';
import { useAllApplications, useDeleteApplication } from '../../../../../hooks/agentApplication/useAgentApplication';

const statusConfig = {
  approved: { cls: 'bg-gray-50 text-emerald-700', label: 'approved' },
  pending: { cls: 'bg-amber-50 text-amber-700', label: 'Pending' },
  rejected: { cls: 'bg-gray-50 text-red-600', label: 'Rejected' },
};

const formatDate = (d) => {
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const AgentList = () => {
  const navigate = useNavigate();
  const { applications, isLoading } = useAllApplications();
  const { deleteApplication, isPending: isDeleting } = useDeleteApplication();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('approved');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const filtered = useMemo(() => {
    return (applications || []).filter(a => {
      const matchSearch =
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  const counts = useMemo(() => ({
    all: (applications || []).length,
    approved: (applications || []).filter(a => a.status === 'approved').length,
    pending: (applications || []).filter(a => a.status === 'pending').length,
    rejected: (applications || []).filter(a => a.status === 'rejected').length,
  }), [applications]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete application?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
      customClass: { popup: 'rounded-2xl' },
    });
    if (!result.isConfirmed) return;
    try {
      await deleteApplication(id);
      Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
      setSelectedAgent(null);
    } catch {
      Swal.fire('Error', 'Failed to delete application.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">
        <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-7 w-40 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-56 bg-gray-100 rounded"></div>
          <div className="h-11 bg-white rounded-xl border border-gray-100"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Applications</h1>
            <p className="text-sm text-gray-400 mt-0.5">All submitted agent applications</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search name, email or city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition shadow-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Agent Request btn */}
            <button
              onClick={() => navigate('/dashboard/agent-request')}
              className="relative flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-100 whitespace-nowrap"
            >
              <Clock size={15} />
              Pending
              {counts.pending > 0 && (
                <span className="absolute -right-1 -top-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5  rounded-full ml-0.5">
                  {counts.pending}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit mb-5">
          {[
            { key: 'approved', label: 'Agents', count: counts.approved },
            { key: 'rejected', label: 'Rejected', count: counts.rejected },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${statusFilter === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${statusFilter === tab.key ? 'bg-indigo-500 text-indigo-100' : 'bg-gray-100 text-gray-500'
                }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name / Email</div>
            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">City</div>
            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</div>
            <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Applied</div>
            <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</div>
            <div className="col-span-1 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <UserCheck size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No applications found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filter.</p>
            </div>
          ) : (
            filtered.map(agent => {
              const sc = statusConfig[agent.status] || statusConfig.pending;
              return (
                <div key={agent._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">

                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-3.5">
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium flex-shrink-0">
                        {agent.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                        <p className="text-xs text-gray-400 truncate">{agent.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" /> {agent.city || '—'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <Briefcase size={12} className="text-gray-400" /> {agent.experience} yrs
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar size={12} className="text-gray-400" /> {formatDate(agent.appliedAt)}
                      </p>
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View profile"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Mobile row */}
                  <div className="md:hidden px-4 py-3.5">

                    {/* Top row — status / date */}
                    <div className="flex items-center justify-between mb-2.5">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${sc.cls}`}>
                        {sc.label}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(agent.appliedAt)}
                      </span>
                    </div>

                    {/* Bottom row — avatar, info and eye */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">
                        {agent.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{agent.name}</p>
                        <p className="text-[11px] text-gray-400 truncate">{agent.email}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1"><MapPin size={10} /> {agent.city}</span>
                          <span className="flex items-center gap-1"><Briefcase size={10} /> {agent.experience} yrs</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors flex-shrink-0"
                      >
                        <Eye size={13} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        <div className="px-1 py-3 mt-1">
          <p className="text-sm text-gray-400">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{applications?.length || 0}</span> applications
          </p>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedAgent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setSelectedAgent(null)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Agent profile</h3>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Avatar and name */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-bold flex-shrink-0">
                  {selectedAgent.name?.charAt(0).toUpperCase() || '?'}
                </div>

                <div className='w-full'>
                  <p className="text-base font-bold text-gray-900">{selectedAgent.name}</p>
                  <div className='flex justify-between'>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedAgent.status]?.cls}`}>
                      {statusConfig[selectedAgent.status]?.label}
                    </span>
                    {
                      selectedAgent.status === 'rejected' && (
                        <button
                          onClick={() => handleDelete(selectedAgent._id)}
                          disabled={isDeleting}
                          className="p-1.5 text-red-600 hover:text-red-500 hover:bg-gray-50 rounded-lg transition disabled:opacity-50"
                          title="Delete application"
                        >
                          <Trash2 size={15} />
                        </button>
                      )
                    }

                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {[
                  { icon: <Mail size={14} className="text-gray-400" />, label: 'Email', value: selectedAgent.email },
                  { icon: <Phone size={14} className="text-gray-400" />, label: 'Phone', value: selectedAgent.phone },
                  { icon: <MapPin size={14} className="text-gray-400" />, label: 'City', value: selectedAgent.city },
                  { icon: <Briefcase size={14} className="text-gray-400" />, label: 'Experience', value: `${selectedAgent.experience} years` },
                  { icon: <Building2 size={14} className="text-gray-400" />, label: 'Specialization', value: selectedAgent.specialization },
                  { icon: <Calendar size={14} className="text-gray-400" />, label: 'Applied', value: formatDate(selectedAgent.appliedAt) },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 flex-shrink-0">{row.icon}</div>
                    <p className="text-xs text-gray-400 w-24 flex-shrink-0">{row.label}</p>
                    <p className="text-sm text-gray-800 font-medium">{row.value || '—'}</p>
                  </div>
                ))}
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText size={13} className="text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500">Bio</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">
                  {selectedAgent.bio || '—'}
                </p>
              </div>

            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => setSelectedAgent(null)}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;