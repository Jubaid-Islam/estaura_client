import React from 'react';
import { Mail, Calendar, Shield, UserCheck, User, BadgeCheck } from 'lucide-react';
import useUser from '../../../hooks/user/useUser';
import { cloudinaryUrl } from '../../../hooks/cloudniaryUrl';

const roleConfig = {
  admin: {
    label: 'Admin',
    icon: <Shield size={12} />,
    pill: 'bg-purple-50 text-purple-800 border-purple-200',
    avatar: 'bg-purple-50 text-purple-800',
  },
  agent: {
    label: 'Agent',
    icon: <UserCheck size={12} />,
    pill: 'bg-teal-50 text-teal-800 border-teal-200',
    avatar: 'bg-teal-50 text-teal-800',
  },
  user: {
    label: 'Member',
    icon: <User size={12} />,
    pill: 'bg-amber-50 text-amber-800 border-amber-200',
    avatar: 'bg-amber-50 text-amber-800',
  },
};

const MyProfile = () => {
  const { data: user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-3 animate-pulse">
          <div className="h-52 bg-gray-100 rounded-2xl" />
          <div className="h-32 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">User not found.</p>
      </div>
    );
  }

  const role = user.role || 'user';
  const config = roleConfig[role] || roleConfig.user;


  const initials = user.name
    ? user.name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Format joined date
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen flex items-center bg-gray-50 p-4 md:p-8">
      <div className="max-w-sm mx-auto w-full">

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">

          {/* Top  */}
          <div className="flex flex-col items-center text-center px-6 py-7 border-b border-gray-100">

            {/* Avatar */}
            <div className="relative mb-4">
              {user.photo ? (
                <img
                  src={cloudinaryUrl(user.photo, { width: 144 })}
                  alt={user.name}
                  className="w-[72px] h-[72px] rounded-full object-cover"
                />
              ) : (
                <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center text-[22px] font-medium ${config.avatar}`}>
                  {initials}
                </div>
              )}
              {/* dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
            </div>

            {/* Name, verified badge */}
            <div className="flex items-center gap-1.5 mb-1">
              <h1 className="text-[17px] font-medium text-gray-900 leading-snug">
                {user.name || 'Unknown'}
              </h1>
              {role === 'agent' && <BadgeCheck size={16} className="text-teal-600 flex-shrink-0" />}
            </div>

            {/* Email */}
            <p className="text-[13px] text-gray-400 mb-3 truncate max-w-full">
              {user.email || '—'}
            </p>

            {/* Role pill */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium border ${config.pill}`}>
              {config.icon}
              {config.label}
            </span>
          </div>

          {/* Info rows */}
          <div>
            <div className="flex items-center gap-3 px-5 py-[14px] border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Mail size={14} />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-0.5">Email address</p>
                <p className="text-[14px] text-gray-800">{user.email || '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-[14px] border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                <Calendar size={14} />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-0.5">Member since</p>
                <p className="text-[14px] text-gray-800">{joinedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-[14px]">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                {config.icon}
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-0.5">Role</p>
                <p className="text-[14px] text-gray-800">{config.label}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyProfile;