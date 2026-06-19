// components/Topbar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Search, X, ChevronRight, Home } from "lucide-react";
import Notifications from "../../../shared/Notifications";
import Profile from "../../../shared/Profile";

const Topbar = () => {
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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

            {/* Search bar — desktop */}
            <div className="hidden md:flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 ${searchFocused
                    ? "w-64 border-indigo-300 bg-white shadow-sm ring-2 ring-indigo-100"
                    : "w-44 border-slate-200 bg-slate-50"
                  }`}
              >
                <Search size={14} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="text-slate-400 hover:text-slate-600 flex-shrink-0"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            <Notifications />


            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            {/* Search icon — mobile */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-slate-700 hover:text-slate-800 hover:bg-slate-100 transition-all"
            >
              <Search size={18} />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 hidden sm:block" />

            <Profile />
          </div>
        </div>

        {/* Mobile search drawer  */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-200 ${mobileSearchOpen ? "max-h-20 border-t border-gray-100" : "max-h-0"
            }`}
        >
          <div className="ml-0 lg:ml-[260px] px-4 py-3">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
              <Search size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search properties, users…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400"
                autoFocus={mobileSearchOpen}
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Topbar;