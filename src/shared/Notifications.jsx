import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import useUser from "../hooks/user/useUser";
import useNotifications from "../hooks/notifications/useNotifications";
import AgentNotifications from "../components/dashboard/pages/agent/agnet-notifications/AgentNotifications";
import AdminNotifications from "../components/dashboard/pages/admin/admin-notifications/AdminNotifications";
import UserNotifications from "../components/dashboard/pages/user/user-notifications/UserNotifications";

const Notifications = () => {
  const { data: currentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const role = currentUser?.role;

  // recipientId: admin="admin", agent=_id, user=email
  const recipientId =
    role === "admin"
      ? "admin"
      : role === "agent"
        ? currentUser?._id?.toString()
        : currentUser?.email;

  const { unreadCount } = useNotifications(recipientId, role);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // only show for logged-in users with a role
  if (!role) return null;

  // specific component to render inside dropdown
  const NotifComponent =
    role === "admin"
      ? AdminNotifications
      : role === "agent"
        ? AgentNotifications
        : UserNotifications;

  return (
    <div className="relative pr-1">

      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-1 rounded-full hover:bg-gray-100 transition"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-11 -right-35 md:right-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)] z-50"
            // className="fixed flex items-center justify-center inset-0 mt-2 w-[400px] max-w-[calc(100vw-2rem)] z-50"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Dropdown header */}
              <div className="flex justify-end items-center px-4 py-3 border-b border-gray-100">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={15} />
                </button>
              </div>
              {/* Notification list */}
              <div className="max-h-[550px] overflow-y-auto bg-gray-50">
                <NotifComponent />
              </div>
            </div>
          </div>
        )}
      </div>

  );
};

export default Notifications;