import { useRef, useState, useEffect, useContext } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { User, LogOut, LogIn, ChevronDown, ChartNoAxesCombined, Home } from 'lucide-react'
import Swal from 'sweetalert2'
import { AuthContext } from '../contexts/AuthContext'

export default function Profile() {
  const { user, logOut } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const isDashboard = location.pathname.startsWith("/dashboard")

  // fallback initials
  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "??"

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setIsOpen(false)
    Swal.fire({
      title: 'Sign out?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      confirmButtonColor: '#4f46e5', // indigo-600
      cancelButtonColor: '#374151', // gray-700
      customClass: { popup: 'rounded-2xl' },
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
        navigate('/signin')
      }
    })
  }

  const menuItems = [
    {
      to: isDashboard ? "/" : "/dashboard",
      icon: isDashboard ? <Home size={16} /> : <ChartNoAxesCombined size={16} />,
      label: isDashboard ? "Home" : "Dashboard"
    },
    { to: "/my-profile", icon: <User size={16} />, label: "My Profile" },

  ]

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {user ? (
        <>
          {/* Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-100 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-95"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {initials}
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user?.displayName?.split(" ")[0]}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`
              absolute right-0 mt-4 w-64 origin-top-right rounded-2xl bg-white border border-gray-100 shadow-xs z-50 transition-all duration-200
              ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
            `}
          >
            {/* User Header */}
            <div className="px-4 py-4 border-b border-gray-50 bg-gray-50/30 rounded-t-2xl">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.displayName}</p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
            </div>

            {/* Menu Links */}
            <div className="p-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}
                  `}
                >
                  <span className={`${location.pathname === item.to ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              ))}

              <div className="my-2 border-t border-gray-50" />

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Sign In Button */
        <NavLink
          to="/signin"
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95"
        >
          <LogIn size={16} />
          Sign In
        </NavLink>
      )}
    </div>
  )
}