import React from "react";
import { Bell, Building2, Calendar, CheckCheck } from "lucide-react";
// import { useNavigate } from "react-router";
import useNotifications from "../../../../../hooks/notifications/useNotifications";
import useUser from "../../../../../hooks/user/useUser";
import { cloudinaryUrl } from "../../../../../hooks/cloudniaryUrl";

const typeBadge = (type) => {
  const map = {
    approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-600" },
    property_submitted: { label: "Submitted", color: "bg-blue-100 text-blue-700" },
    new_message: { label: "New Message", color: "bg-purple-100 text-purple-700" },
  };
  return map[type] || { label: type, color: "bg-gray-100 text-gray-500" };
};

const UserNotifications = () => {
  const { data: currentUser } = useUser();
  const { notifications, isLoading, markAllRead, markOneRead, unreadCount } =
    useNotifications(currentUser?.email, "user");
    
  // const navigate = useNavigate();
  const visibleNotifications = Array.isArray(notifications) ? notifications.slice(0, 20) : [];

  const handleNotifClick = (notif) => {
    if (!notif.isRead) markOneRead(notif._id);
    // if (notif.propertyId) navigate(`/property/${notif.propertyId}`);
  };

  const formatDate = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl border border-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 dm-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition"
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* List */}
      {visibleNotifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="text-gray-300" size={28} />
          </div>
          <p className="text-sm font-medium text-gray-600">No notifications</p>
          <p className="text-xs text-gray-400 mt-1">Property updates will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleNotifications.map((notif) => {
            const badge = typeBadge(notif.type);
            return (
              <div
                key={notif._id}
                onClick={() => handleNotifClick(notif)}
                className={`flex gap-3 p-4 rounded-2xl border transition cursor-pointer hover:shadow-sm hover:scale-[1.01] ${!notif.isRead
                    ? "bg-indigo-50/60 border-indigo-100 hover:bg-indigo-50"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                  }`}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {notif.propertyImage ? (
                    <img src={cloudinaryUrl(notif.propertyImage, { width: 120 })} alt="" loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                       <div className="w-full h-full flex items-center justify-center bg-indigo-50">
                          <Building2 size={20} className="text-indigo-400" />
                        </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{notif.message}</p>
                    {!notif.isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-1" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={11} /> {formatDate(notif.createdAt)}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;