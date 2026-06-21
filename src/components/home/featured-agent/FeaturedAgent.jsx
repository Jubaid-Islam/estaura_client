import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Star, Phone, Mail, MapPin, UserPlus, ArrowRight, BadgeCheck, House } from 'lucide-react';

const FeaturedAgent = () => {
    const [isVisible, setIsVisible] = useState(false);
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
  

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach((entry) => setIsVisible(entry.isIntersecting)),
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="dm-sans py-10 md:py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-3">Agents</h2>
                    <p className="text-gray-500">Connect with our top-rated real estate agents</p>
                </div>



                {/* Horizontal Scrollable Container */}
                <div
                    className="flex md:grid overflow-x-auto md:overflow-visible pb-8 gap-6 snap-x snap-mandatory no-scrollbar touch-pan-x md:grid-cols-2 lg:grid-cols-4"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        touchAction: 'pan-x pan-y'
                    }}
                >
                    {agents.map((agent, index) => (
                        <div
                            key={agent.id}
                            className={`group bg-white rounded-2xl shadow-md border border-gray-100 flex-shrink-0 w-[280px] md:w-auto snap-start transition-all duration-700
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="relative h-48 overflow-hidden rounded-t-2xl">
                                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 bg-white/95 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" /> {agent.rating}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-sm font-bold text-gray-800">{agent.name}</h3>
                                <p className="text-xs text-indigo-500 font-semibold mb-3">{agent.title}</p>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                                    <MapPin size={14} /> {agent.location}
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                                    <div className="flex items-center gap-1"><BadgeCheck size={14} /> {agent.experience} yrs</div>
                                    <div className="flex items-center gap-1"><House size={14} /> {agent.sales} sales</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Join CTA */}
                <div className='flex justify-center'>
                    <div className="relative md:min-w-3xl text-center rounded-2xl p-10 overflow-hidden mt-8">
                        <img src="https://media.istockphoto.com/id/1309536865/photo/handshake.webp?a=1&b=1&s=612x612&w=0&k=20&c=Dx-86RUvFUkkqNCf3pB0DMri99xNrqnH95grjKfMfc4=" className="absolute inset-0 w-full h-full object-cover" alt="cta" />
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-6">Grow Your Real Estate Business?</h3>
                            <p className='text-white mb-4 hidden md:block'>Join our platform and get access to thousands of potential buyers and sellers.</p>
                            <NavLink to="/join-agent" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                                Join as Agent <ArrowRight size={18} />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </section>
    );
};

export default FeaturedAgent;