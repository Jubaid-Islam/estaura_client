import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, ImagePlus, ShieldCheck, Handshake,
  BadgeCheck, TrendingUp, Users, Star,
  ChevronDown, ChevronUp, ArrowRight, Home,
  DollarSign, Clock, CheckCircle,
  ArrowLeft
} from 'lucide-react';

const steps = [
  {
    icon: <ClipboardList size={22} className="text-indigo-600" />,
    bg: "bg-indigo-50",
    step: "01",
    title: "Fill in property basics",
    desc: "Add your property title, type, price, number of bedrooms, bathrooms, area in sqft, and a detailed description. This takes about 2 minutes.",
    details: ["Property title & description", "Property type (apartment, house, condo, land, commercial)", "Price, SQFT, beds & baths", "Year built (optional)"],
  },
  {
    icon: <ImagePlus size={22} className="text-emerald-600" />,
    bg: "bg-emerald-50",
    step: "02",
    title: "Add location & photos",
    desc: "Enter the full address and upload up to 10 high-quality images. Better photos attract more serious buyers.",
    details: ["Street address, city, state & ZIP", "Upload up to 10 property photos", "PNG or JPG, up to 10MB each"],
  },
  {
    icon: <ShieldCheck size={22} className="text-amber-600" />,
    bg: "bg-amber-50",
    step: "03",
    title: "Submit for review",
    desc: "Your listing goes to our admin team for a quick quality review. We verify the details to ensure buyers see only genuine, accurate listings.",
    details: ["Listing reviewed within 24 hours", "Admin checks accuracy & completeness", "You get notified once approved"],
  },
  {
    icon: <BadgeCheck size={22} className="text-blue-600" />,
    bg: "bg-blue-50",
    step: "04",
    title: "Listing goes live",
    desc: "Once approved, your property is published and visible to thousands of verified buyers browsing our platform.",
    details: ["Published on the main property feed", "Searchable by type, price & location", "Featured option for higher visibility"],
  },
  {
    icon: <Users size={22} className="text-purple-600" />,
    bg: "bg-purple-50",
    step: "05",
    title: "Agent gets assigned",
    desc: "Our admin assigns a dedicated agent to your property. The agent handles buyer inquiries, negotiations, and guides you through the deal.",
    details: ["Experienced local agent assigned", "Agent contacts you directly", "Handles all buyer communication"],
  },
  {
    icon: <Handshake size={22} className="text-rose-600" />,
    bg: "bg-rose-50",
    step: "06",
    title: "Deal closed",
    desc: "Once a buyer is found and the proposal is accepted, the deal is finalized. You get paid and the property is marked as sold.",
    details: ["Buyer submits proposal", "You accept via your dashboard", "Payment processed & deal closed"],
  },
];

const faqs = [
  {
    q: "How long does the review take?",
    a: "Our admin team reviews listings within 24 hours. You'll receive a notification once your property is approved or if any changes are needed."
  },
  {
    q: "Is there a commission fee?",
    a: "No commission fees. We charge zero commission on property sales. Our platform fee structure is transparent and you'll see all costs upfront."
  },
  {
    q: "Can I edit my listing after submission?",
    a: "Yes. You can edit your listing at any time from your dashboard. Changes to approved listings may require a brief re-review."
  },
  {
    q: "How are buyers verified?",
    a: "All buyers on our platform go through an identity verification process before they can contact agents or submit proposals."
  },
  {
    q: "What if I want to remove my listing?",
    a: "You can remove your listing at any time from your dashboard. Simply go to your submitted properties and delete the listing."
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        {open
          ? <ChevronUp size={16} className="text-indigo-500 flex-shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <p className="text-sm text-gray-500 leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
};

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50/80 min-h-screen dm-sans mt-20 ">



      {/* Hero */}
      <div className="bg-white">
      <div className="border-b border-gray-100 p-4 md:py-12 md:px-10 text-center max-w-7xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex justify-start items-center gap-2 font-medium text-sm text-gray-700 hover:text-indigo-600 transition group mb-16 mt-2"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>


        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          From listing to <span className="text-indigo-600">sold</span> — in 6 simple steps
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8">
          We handle the complexity. You just fill in your property details and our platform takes care of the rest — from review to closing the deal.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {[
            { icon: <Users size={16} />, value: "10K+", label: "Happy sellers" },
            { icon: <TrendingUp size={16} />, value: "$2.5B+", label: "Properties sold" },
            { icon: <Star size={16} />, value: "98%", label: "Success rate" },
            { icon: <Clock size={16} />, value: "24hr", label: "Avg. review time" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500">
              <span className="text-indigo-500">{s.icon}</span>
              <span className="font-bold text-gray-900">{s.value}</span>
              <span className="text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
      <div className="max-w-7xl mx-auto px-10 py-16 space-y-16">

        {/* Steps */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">The selling process</h2>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>

            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className="relative flex gap-5">
                  {/* Step dot */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0 z-10 relative`}>
                      {s.icon}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-1">
                    <div className="flex items-start gap-3">
                      <div className={`md:hidden w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                        {s.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-300">STEP {s.step}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">{s.title}</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-3">{s.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.details.map((d, j) => (
                            <span key={j} className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                              <CheckCircle size={11} className="text-indigo-400" /> {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why us */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Why sell with us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <DollarSign size={20} className="text-emerald-600" />, bg: "bg-emerald-50", title: "Best market value", desc: "We price your property competitively to attract serious buyers fast." },
              { icon: <ShieldCheck size={20} className="text-indigo-600" />, bg: "bg-indigo-50", title: "Verified buyers only", desc: "All buyers are ID-verified before they can contact your agent." },
              { icon: <Home size={20} className="text-amber-600" />, bg: "bg-amber-50", title: "Dedicated agent", desc: "A real estate professional is assigned to guide every deal to close." },
            ].map((w, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 ${w.bg} rounded-xl flex items-center justify-center mb-3`}>
                  {w.icon}
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">{w.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently asked questions</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>


      </div>
    </div>
  );
};

export default LearnMore;