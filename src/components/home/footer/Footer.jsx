import { NavLink } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Heart,
  X,
  XIcon,
} from 'lucide-react';
import Logo from '../../../shared/Logo';

const Footer = () => {

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Buy', path: '/buy' },
    { name: ' Rent', path: '/rent' },
    { name: 'Agents', path: '/toprated-agent' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100050057114829', label: 'Facebook' },
    { icon: XIcon, href: 'https://x.com/Jubaid_19', label: 'X' },
    { icon: Instagram, href: 'https://www.instagram.com/jubaidd_?igsh=MXQweGxsb3l2ZjZjdw==', label: 'Instagram' },
    { icon: Linkedin, href: 'www.linkedin.com/in/jubaid-islam-522b61283', label: 'LinkedIn' }
  ];

  return (
    <footer className="dm-sans bg-gray-100 text-gray-700 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className='flex items-center'>
              <Logo></Logo>
              <h2 className="text-2xl font-semibold text-[#486be3] ml-2">
                Estaura
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with ease and transparency.
            </p>
            <div className=" items-center text-sm text-indigo-600/90">
              <span>Over 10,000+ happy customers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 -translate-x-2"
                    />
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
      

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">CHhattogram, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-indigo-600 transition">
                  +8801700-000000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-500 flex-shrink-0" />
                <a href="mailto:info@realestate.com" className="text-gray-600 hover:text-indigo-600 transition">
                 jubaid2006@gmail.com
                </a>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-2 rounded-full shadow-sm text-gray-600 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>


        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 mt-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;