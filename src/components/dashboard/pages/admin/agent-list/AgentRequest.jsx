// AgentRequest.jsx
import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, X, CheckCircle, XCircle,
  MapPin, Briefcase, Calendar, Mail, Phone,
  FileText, Building2, Eye, Clock, UserCheck
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import {
  usePendingApplications,
  useApproveApplication,
  useRejectApplication,
} from '../../../../../hooks/agentApplication/useAgentApplication';

const formatDate = (d) => {
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

const AgentRequest = () => {
  const navigate = useNavigate();
  const { applications, isLoading, refetch } = usePendingApplications();
  const { approveApplication, } = useApproveApplication();
  const { rejectApplication, } = useRejectApplication();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return applications || [];
    return (applications || []).filter(a =>
      a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applications, searchTerm]);

  const handleApprove = async (id) => {
    const result = await Swal.fire({
      title: 'Approve application?',
      text: 'This will upgrade the user role to Agent.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, approve',
      customClass: { popup: 'rounded-2xl' },
    });
    if (!result.isConfirmed) return;
    try {
      await approveApplication(id);
      Swal.fire({ icon: 'success', title: 'Approved!', timer: 1500, showConfirmButton: false });
      setSelectedAgent(null);
      refetch();
    } catch {
      Swal.fire('Error', 'Failed to approve application.', 'error');
    }
  };

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Reject application?',
      text: 'The applicant will be notified.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, reject',
      customClass: { popup: 'rounded-2xl' },
    });
    if (!result.isConfirmed) return;
    try {
      await rejectApplication(id);
      Swal.fire({ icon: 'success', title: 'Rejected!', timer: 1500, showConfirmButton: false });
      setSelectedAgent(null);
      refetch();
    } catch {
      Swal.fire('Error', 'Failed to reject application.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">
        <div className="animate-pulse space-y-4 max-w-5xl mx-auto">
          <div className="h-7 w-40 bg-gray-200 rounded-lg"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen dm-sans">
      <div className="max-w-5xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-indigo-600 transition group mb-6"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">Agent Requests :</h1>
              {filtered.length > 0 && (
                <span className="px-2.5 py-0.5  text-indigo-700 text-xl font-bold rounded-full flex items-center gap-1">
                  {applications?.length || 0}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400">Review and approve pending agent applications</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Desktop header */}
          <div className="hidden md:grid grid-cols-[1fr_120px_120px_130px_180px] gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name / Email</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">City</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Experience</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Applied</div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <UserCheck size={24} className="text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-600">No pending requests</p>
              <p className="text-xs text-gray-400">All applications have been reviewed.</p>
            </div>
          ) : (
            filtered.map(agent => (
              <div key={agent._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">


                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[1fr_120px_120px_130px_180px] gap-4 items-center px-6 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
                      {agent.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                      <p className="text-xs text-gray-400 truncate">{agent.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <MapPin size={12} className="text-gray-400" /> {agent.city || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Briefcase size={12} className="text-gray-400" /> {agent.experience} yrs
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" /> {formatDate(agent.appliedAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="py-2 px-4 text-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View profile"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleApprove(agent._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 rounded-lg transition"
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(agent._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-indigo-600 text-xs font-semibold hover:bg-gray-200 rounded-lg transition"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                </div>


                {/* Mobile row */}
                <div className="md:hidden px-4 py-3.5">

                  {/* Top — date and eye */}
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar size={10} /> {formatDate(agent.appliedAt)}
                    </span>
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                    >
                      <Eye size={13} />
                    </button>
                  </div>

                  {/* Middle — avatar and info */}
                  <div className="flex items-center gap-3 mb-3">

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
                  </div>

                  {/* Bottom — actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(agent._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600 text-white  text-[12px] font-medium hover:bg-indigo-700 transition-colors"
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(agent._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 text-indigo-600 text-[12px] font-medium hover:bg-gray-200 transition-colors"
                    >
                      <XCircle size={13} /> Reject
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-1 py-3 mt-1">
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-gray-700">{filtered.length}</span> pending requests
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
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Application details</h3>
              <button onClick={() => setSelectedAgent(null)} className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-400">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-bold flex-shrink-0">
                  {selectedAgent.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">{selectedAgent.name}</p>
                  <p className="text-xs text-gray-400">{selectedAgent.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {[
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

export default AgentRequest;