import React, { useState } from 'react';
import useAllUsers from '../../../../../hooks/user/useAllUsers';
import Swal from 'sweetalert2';
import { Search, Shield, UserCheck, User } from 'lucide-react';
import ActionBtn from './ActionBtn';
import { updateRole, deleteUser } from '../../../../../api/usersApi';
import useAxiosSecure from '../../../../../axios/useAxiosSecure';

const AVATAR_COLORS = [
  'bg-purple-50 text-purple-800',
  'bg-blue-50 text-blue-800',
  'bg-teal-50 text-teal-800',
  'bg-indigo-50 text-indigo-800',
  'bg-pink-50 text-pink-800',
];
const getAvatarColor = (id = '') =>
  AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];

const getInitials = (name = '') =>
  name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

const roleConfig = {
  admin: {
    label: 'Admin',
    cls: ' text-purple-800',
  },
  agent: {
    label: 'Agent',
    cls: ' text-blue-800',
  },
  user: {
    label: 'User',
    cls: ' text-teal-800',
  },
};

export default function ManagerUsers() {
  const { data: users = [], isLoading, refetch } = useAllUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const axiosSecure = useAxiosSecure();

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;
    const result = await Swal.fire({
      title: 'Confirm role change?',
      text: `Change ${user.name}'s role to ${newRole}?`,
      showCancelButton: true,
      confirmButtonColor: '#534AB7',
      cancelButtonColor: '#D3D1C7',
      confirmButtonText: 'Yes, change it',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await updateRole(user._id, newRole, axiosSecure);
      if (res.modifiedCount > 0) {
        Swal.fire({ icon: 'success', showConfirmButton: false, timer: 1500 });
        refetch();
      }
    } catch {
      Swal.fire({ title: 'Error', text: 'Could not change role.', icon: 'error' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete user?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonColor: '#E24B4A',
      cancelButtonColor: '#D3D1C7',
      confirmButtonText: 'Yes, delete',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await deleteUser(id, axiosSecure);
      if (res.deletedCount > 0) {
        Swal.fire({ icon: 'success', showConfirmButton: false, timer: 1500 });
        refetch();
      }
    } catch {
      Swal.fire({ title: 'Error', text: 'Could not delete user.', icon: 'error' });
    }
  };

  if (isLoading) return (
    <div className="p-6 space-y-3 animate-pulse">
      <div className="h-8 w-40 bg-gray-100 rounded-lg" />
      <div className="h-10 w-56 bg-gray-100 rounded-lg" />
      {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl" />)}
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">Manage users</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage team members and their permissions</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-64">
            <Search size={13} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

          {/* Desktop thead */}
          <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_110px_130px_96px] gap-3 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            {['Name', 'Role', 'Last active', 'Actions'].map((h, i) => (
              <span
                key={h}
                className={`text-[11px] uppercase tracking-wider text-gray-400 font-medium ${i === 3 ? 'text-right pr-2' : ''}`}
              >
                {h}
              </span>
            ))}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No users found</p>
              <p className="text-xs text-gray-400">Try adjusting your search term.</p>
            </div>
          ) : filteredUsers.map((user) => {
            const role = user.role || 'user';
            const rc = roleConfig[role] || roleConfig.user;
            const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

            return (
              <div
                key={user._id}
                className="flex md:grid md:grid-cols-[1fr_110px_130px_96px] items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Name and avatar */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-medium flex-shrink-0 ${getAvatarColor(user._id)}`}>
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="hidden md:block">
                  <span className={`inline-flex items-center py-0.5 rounded-full text-[11px] font-medium  ${rc.cls}`}>
                    {rc.label}
                  </span>
                </div>

                {/* Last active */}
                <div className="hidden md:block">
                  {lastLogin ? (
                    <>
                      <p className="text-[12px] text-gray-700">
                        {lastLogin.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {lastLogin.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </>
                  ) : <p className="text-[12px] text-gray-400">—</p>}
                </div>

                {/* Actions */}
                {user.role !== "admin" && (
                  <div className="flex items-center justify-end ml-auto md:ml-0">
                    <ActionBtn
                      user={user}
                      onRoleChange={handleRoleChange}
                      onDelete={handleDelete}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-1 py-3 mt-1">
          <p className="text-sm text-gray-400">
            Showing <span className="text-indigo-800 font-medium px-1">{filteredUsers.length}</span> results
          </p>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 bg-indigo-50 rounded-lg border border-gray-200 text-indigo-700 hover:bg-indigo-100 transition-colors">
              Previous
            </button>
            <button className="text-xs px-3 py-1.5 bg-indigo-50 rounded-lg border border-gray-200 text-indigo-700 hover:bg-indigo-100 transition-colors">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}