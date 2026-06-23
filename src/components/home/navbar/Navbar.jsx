import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Search,
  Activity,
  Trophy,
  Home,
  ShoppingBag,
  Key,
  Tag,
  Mail,
  Users
} from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../contexts/AuthContext';
import Logo from '../../../shared/Logo';
import Profile from '../../../shared/Profile';
import Notifications from '../../../shared/Notifications';
import Messages from '../../../shared/Messages';

const Navbar = () => {

  // UI State
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAgentOpen, setAgentOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation Links Data
  const mainNavLinks = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Rent', path: '/rent', icon: <Key size={18} /> },
    { name: 'Buy', path: '/buy', icon: <ShoppingBag size={18} /> },
    { name: 'Sell', path: '/sell', icon: <Tag size={18} /> },
  ];

  const agentLinks = [
    { name: 'Top Rated Agents', href: '/toprated-agent', icon: <Trophy size={16} />, desc: 'Verified pros, proven results' },
    { name: 'Join as Agent', href: '/join-agent', icon: <ShieldCheck size={16} />, desc: 'Scale your property sales' },
  ];

  // Dynamic Styles
  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-0.5 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:rounded-full after:bg-indigo-600 after:transition-all after:duration-300 ${
      isActive ? 'text-indigo-600 after:w-full' : 'text-gray-700 hover:text-indigo-600 after:w-0 hover:after:w-full'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 h-12 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
    }`;

  return (
    <>
      <style>{`
        .agent-dropdown {
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px) scale(0.98);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .agent-trigger:hover .agent-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }
        .agent-trigger:hover .chevron-icon { transform: rotate(180deg); }

        .nav-icon-anim {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .group:hover .nav-icon-anim {
          transform: translateX(4px) scale(1.1);
        }
      `}</style>

   
      <div className="flex justify-center">
        <header
          className={`
            fixed z-50 transition-all duration-500 ease-in-out dm-sans
            ${scrolled 
              ? 'top-2  w-[95%] max-w-7xl rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm' 
              : 'top-4 w-[95%] max-w-7xl rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm'}
          `}
        >
          <div className="px-4 py-2 md:py-0 sm:px-6 lg:px-8">
            <div className='flex justify-between items-center transition-all duration-500'>
              
              <div className="flex items-center gap-16">
                <Logo />

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                  {mainNavLinks.map((link) => (
                    <NavLink key={link.name} to={link.path} className={navLinkClass}>
                      {link.name}
                    </NavLink>
                  ))}

                  {/* Agent Dropdown */}
                  <div className="agent-trigger relative flex items-center h-[72px] cursor-pointer">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
                      Agents
                      <ChevronDown size={14} className="chevron-icon text-gray-400 mt-px transition-transform" />
                    </div>

                    <div className="agent-dropdown absolute left-0 top-[65px] w-[280px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                      <div className="px-5 pt-4 pb-3 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                          <Activity size={14} className="text-indigo-600" />
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Agent Network</span>
                        </div>
                      </div>
                      <div className="p-2">
                        {agentLinks.map((item) => (
                          <NavLink key={item.name} to={item.href} className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 group transition-colors">
                            <div className="w-9 h-9 border border-gray-100 bg-white rounded-lg flex items-center justify-center text-gray-500 shadow-sm group-hover:text-indigo-600 transition-all">
                              {item.icon}
                            </div>
                            <div className='dm-sans'>
                              <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600">{item.name}</p>
                              <p className="text-[11px] text-gray-500">{item.desc}</p>
                            </div>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>

                  <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </nav>
              </div>

              {/* Action Icons & Profile */}
              <div className="flex items-center gap-2 sm:gap-4">
                <Messages/>
                <Notifications />
                <Profile />
                <button 
                  onClick={() => setMobileMenuOpen(true)} 
                  className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-xl transition-all"
                >
                  <Menu size={22} />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/*  Mobile Drawer  */}
      <div 
        className={`fixed inset-0 z-[60] bg-gray-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setMobileMenuOpen(false)} 
      />

      <div className={`fixed left-0 top-0 h-full w-[280px] bg-white z-[70] md:hidden shadow-2xl flex flex-col transition-transform duration-400 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Logo />
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-indigo-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {mainNavLinks.map((link) => (
            <NavLink key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
              <span className="nav-icon-anim text-gray-400 group-[.active]:text-indigo-600">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}

          <div className="pt-2">
            <button onClick={() => setAgentOpen(!isAgentOpen)} className="flex items-center justify-between w-full h-12 px-4 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-gray-400" />
                <span>Agents</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isAgentOpen ? 'rotate-180 text-indigo-600' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isAgentOpen ? 'max-h-60 mt-1' : 'max-h-0'}`}>
              <div className="ml-9 border-l-2 border-gray-50 space-y-1">
                {agentLinks.map((item) => (
                  <NavLink key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 font-medium h-10 px-4 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                      <span className="nav-icon-anim text-gray-400 group-[.active]:text-indigo-600">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={mobileNavLinkClass}>
            <Mail size={18} className="nav-icon-anim text-gray-400 group-[.active]:text-indigo-600" />
            Contact
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Navbar;