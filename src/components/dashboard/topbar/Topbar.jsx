import { NavLink, useLocation } from "react-router-dom";
import { Search, X, ChevronRight, Home } from "lucide-react";
import Notifications from "../../../shared/Notifications";
import Profile from "../../../shared/Profile";
import Messages from "../../../shared/Messages";

const Topbar = () => {
  const location = useLocation();

  // Build breadcrumb
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, idx) => ({
    name: segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    path: "/" + pathSegments.slice(0, idx + 1).join("/"),
  }));

  const currentPage =
    breadcrumbItems.length > 0
      ? breadcrumbItems[breadcrumbItems.length - 1].name
      : "Dashboard";

  return (
    <>
      {/* Topbar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-20 bg-white border-b border-gray-200">
        {/* Left offset to clear the sidebar on desktop */}
        <div className="ml-0 lg:ml-[260px] h-full flex items-center justify-between px-5 gap-4">

          {/* left: Breadcrumb  */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Page title pill (mobile) */}
            <span className="lg:hidden text-slate-800 font-semibold text-sm ml-10 truncate">
              {currentPage}
            </span>

            {/* Breadcrumb (desktop) */}
            <nav className="hidden lg:flex items-center gap-1 text-sm min-w-0">
              <NavLink
                to="/"
                className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <Home size={15} />
              </NavLink>

              {breadcrumbItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1 min-w-0">
                  <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-lg text-sm font-medium transition-all truncate ${isActive
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}

              {breadcrumbItems.length === 0 && (
                <span className="ml-1 text-slate-800 font-semibold">Dashboard</span>
              )}
            </nav>
          </div>

          {/* right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">

            <Messages />
            <Notifications />


            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            <Profile />
          </div>
        </div>


      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Topbar;