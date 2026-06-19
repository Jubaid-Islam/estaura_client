import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Star, Phone, Mail, MapPin, UserPlus, ArrowRight, BadgeCheck, House } from 'lucide-react';

const FeaturedAgent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const sectionRef = useRef(null);


    const agents = [
        {
            id: 1,
            name: 'Sarah Johnson',
            title: 'Luxury Property Specialist',
            location: 'New York, NY',
            rating: 4.9,
            reviews: 128,
            experience: 12,
            sales: 245,
            image: 'https://media.istockphoto.com/id/2234289516/photo/portrait-of-smiling-mature-businessman-wearing-glasses-standing-in-empty-office.webp?a=1&b=1&s=612x612&w=0&k=20&c=ep1w1SAJBfic7dktMtjnZYiHJF9Oy0qr-JsovHmM550=',
            phone: '+1 (212) 555-0123',
            email: 'sarah.j@realestate.com'
        },
        {
            id: 2,
            name: 'Michael Chen',
            title: 'Senior Real Estate Agent',
            location: 'Los Angeles, CA',
            rating: 4.8,
            reviews: 98,
            experience: 8,
            sales: 189,
            image: 'https://plus.unsplash.com/premium_photo-1682430145886-39c8decd85fa?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D',
            phone: '+1 (310) 555-0456',
            email: 'michael.c@realestate.com'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            title: 'Top Producer',
            location: 'Miami, FL',
            rating: 5.0,
            reviews: 156,
            experience: 10,
            sales: 312,
            image: 'https://media.istockphoto.com/id/2225667429/photo/portrait-of-a-young-smiling-and-confident-office-worker-and-businessman-sitting-at-his-desk.webp?a=1&b=1&s=612x612&w=0&k=20&c=rLgc-nLzl9Jxwh2BkXTFIiFMtgQEz2clQlfnUF596-Q=',
            phone: '+1 (305) 555-0789',
            email: 'emily.r@realestate.com'
        },
        {
            id: 4,
            name: 'David Kim',
            title: 'Commercial & Residential',
            location: 'Chicago, IL',
            rating: 4.7,
            reviews: 87,
            experience: 6,
            sales: 142,
            image: 'https://images.unsplash.com/photo-1757406005026-990a2b022e49?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            phone: '+1 (312) 555-0987',
            email: 'david.k@realestate.com'
        }
    ];

    // Filter agents based on search
    const filteredAgents = agents.filter(agent =>
        agent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Scroll animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="dm-sans py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Agents</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Connect with our top-rated real estate agents to find your dream home
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by Location or Agent Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-gray-700 placeholder-gray-400 bg-white shadow-sm"
                        />
                    </div>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {filteredAgents.map((agent, index) => (
                        <div
                            key={agent.id}
                            className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl  hover:-translate-y-1 border border-gray-100
                transform transition-all duration-700 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
                            style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                        >
                            {/* Agent Image */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                                <img
                                    src={agent.image}
                                    alt={agent.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    width="400"
                                    height="200"
                                />
                                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    <span>{agent.rating}</span>
                                </div>
                            </div>

                            {/* Agent Info */}
                            <div className="p-5">
                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                    {agent.name}
                                </h3>
                                <p className="text-xs text-indigo-500 font-semibold mt-0.5 mb-2">{agent.title}</p>

                                {/* Location */}
                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{agent.location}</span>
                                </div>


                                {/* Stats */}
                                <div className="hidden md:flex items-center justify-between gap-6 pt-3 border-t border-gray-100 text-xs text-gray-500">

                                    <div className="flex items-center gap-1">
                                        <BadgeCheck className="w-3 h-4" />
                                        <span>{agent.experience} years</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <House className="w-3 h-4" />
                                        <span>{agent.sales} sales</span>
                                    </div>

                                </div>

                                {/* Contact Buttons
                                <div className="flex gap-2 mt-4">
                                    <button className="flex-1 flex items-center justify-center gap-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors">
                                        <Phone size={12} /> Contact
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-xs font-semibold hover:bg-gray-100 transition-colors">
                                        <Mail size={12} /> Email
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    ))}
                </div>

                {/* No results message */}
                {filteredAgents.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No agents found matching "{searchTerm}"</p>
                    </div>
                )}

                {/* Join as Agent CTA */}
                <div
                    className={`relative text-center rounded-2xl p-8 md:p-10 max-w-3xl mx-auto overflow-hidden transition-all duration-700 delay-200
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                >
                    
                    <img
                        src="https://media.istockphoto.com/id/1309536865/photo/handshake.webp?a=1&b=1&s=612x612&w=0&k=20&c=Dx-86RUvFUkkqNCf3pB0DMri99xNrqnH95grjKfMfc4="
                        alt="background"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                    />


                    <div className="absolute inset-0 bg-black/30"></div>

                 
                    <div className="relative z-10 flex flex-col items-center">

                        <div className="inline-flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full p-3 mb-4">
                            <UserPlus size={28} className="text-white" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Want to Grow Your Real Estate Business?
                        </h3>

                        <p className="text-gray-200 mb-6 max-w-md">
                            Join our platform and get access to thousands of potential buyers and sellers.
                        </p>

                        <NavLink
                            to="/join-agent"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl group"
                        >
                            Join as Agent
                            <ArrowRight
                                size={18}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </NavLink>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedAgent;