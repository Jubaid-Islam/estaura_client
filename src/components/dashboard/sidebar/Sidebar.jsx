// components/Sidebar.jsx
import { useState, useEffect, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useUsers from "../../../hooks/user/useUser";
import { menu } from "../menu/menu";
import {
  X,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import Logo from "../../../shared/Logo";
import Swal from "sweetalert2";
import { AuthContext } from "../../../contexts/AuthContext";
import SidebarSkeleton from "../../loading/SidebarSkeleton";

export const SIDEBAR_WIDTH = 260;

const NavItem = ({ item, closeMobileSidebar }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    item.children?.some((c) => location.pathname.includes(c.path)) || false
  );
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    const anyChildActive = item.children.some((c) => location.pathname.includes(c.path));
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
            anyChildActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className={`transition-transform duration-300 group-hover:scale-110 ${anyChildActive ? "text-indigo-600" : "text-gray-500"}`}>
                {item.icon}
              </span>
            )}
            <span>{item.name}</span>
          </div>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        
        {/* Smooth Slide */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
          <div className="ml-6 border-l-2 border-gray-100 space-y-1">
            {item.children.map((child) => (
              <NavItem key={child.path} item={child} closeMobileSidebar={closeMobileSidebar} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      onClick={closeMobileSidebar}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {item.icon && <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>{item.icon}</span>}
          <span>{item.name}</span>
          {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
        </>
      )}
    </NavLink>
  );
};

// Sidebar Main Component 
const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { data: me, isLoading } = useUsers();
  const { logOut } = useContext(AuthContext);

  const dashboardMenu = menu[me?.role] || [];
  const sections = (dashboardMenu[0]?.items) ? dashboardMenu : [{ title: "Navigation", items: dashboardMenu }];

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Sign out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      confirmButtonColor: "#4f46e5",
    }).then((result) => { if (result.isConfirmed) logOut(); });
  };

  if(isLoading) {
    return <SidebarSkeleton/>
  }
  return (
    <>
      <style>{`
        .sidebar-bezier {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Mobile Hamburger */}
      <div className="lg:hidden fixed top-4 left-3 z-40 p-2 items-center">
      <Logo/>
      </div>

      {/* Backdrop Overlay  */}
      <div
        className={`fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-500 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Main Sidebar Drawer */}
      <aside
        className={`sidebar-bezier fixed top-0 left-0 z-[70] h-full w-[280px] bg-white border-r border-gray-200 flex flex-col shadow-2xl lg:shadow-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:z-40`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <Logo />
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              {section.title && (
                <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{section.title}</h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.path || item.name} item={item} closeMobileSidebar={() => setMobileOpen(false)} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / User Card */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
              {me?.photo ? (
                <img src={me.photo} alt={me.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {me?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{me?.name || "Guest"}</p>
              <p className="text-[10px] text-indigo-600 font-medium uppercase tracking-tighter">{me?.role || "Member"}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Spacer */}
      <div className="hidden lg:block flex-shrink-0 w-[280px]" />
    </>
  );
};

export default Sidebar;