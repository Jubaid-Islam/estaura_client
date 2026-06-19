import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin, Phone, Mail, Heart, Share2, Home,
  Send, MessageCircle, Ruler, Bed, Bath, User,
  ArrowLeft, AlertTriangle, Ban, MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useSingleProperty from "../../hooks/property/useSingleProperty";
import useAgentInfo from "../../hooks/property/useAgentInfo";
import useUser from "../../hooks/user/useUser";
import useCreateConversation from "../../hooks/conversation/useCreateConversations";
import useAxiosSecure from "../../axios/useAxiosSecure";
import { checkConversation } from "../../api/conversationApi";
import { cloudinaryUrl } from "../../hooks/cloudniaryUrl";
import PropertyMap from "./PropertyMap";
import DetailsSkeleton from "../loading/DetailsSkeleton";

const DEAL_STATUS_BANNER = {
  negotiating: {
    icon: <MessageCircle size={15} />,
    message: "This property is currently under negotiation.",
    color: "bg-yellow-50 text-yellow-700",
  },
  deal_closed: {
    icon: <Ban size={15} />,
    message: "This property is no longer available. The deal has been closed.",
    color: "bg-red-50 text-red-500",
  },
};

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: property, isLoading, error } = useSingleProperty(id);
  const [agentInfo] = useAgentInfo(id);
  const { data: currentUser } = useUser();
  const { createConversation: startConversation, isPending: isStarting } = useCreateConversation();

  const [activeImage, setActiveImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [messageSent, setMessageSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agent = agentInfo?.agentInfo;
  const agentName = agent?.name || null;
  const agentEmail = agent?.email || null;
  const agentInitials = agentName
    ? agentName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const dealBanner = DEAL_STATUS_BANNER[property?.dealStatus] || null;

  // check existing conversation
  const { data: existingConv } = useQuery({
    queryKey: ["conversation-check", id, currentUser?._id],
    queryFn: () => checkConversation(id, currentUser._id.toString(), axiosSecure),
    enabled: !!currentUser?._id && !!id,
    select: (data) => data.data,
  });


  useEffect(() => {
    if (existingConv?._id) setMessageSent(true);
  }, [existingConv]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(price);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await startConversation({
        propertyId: id,
        propertyTitle: property.title,
        propertyImage: property.images?.[0] || "",
        propertyCity: property.city || "",
        propertyType: property.propertyType || "",
        propertyPrice: property.price || 0,
        listingType: property.listingType || "buy",
        agentId: agentInfo?.agentInfo?._id?.toString() || property.agentId?.toString(),
        agentName: agentInfo?.agentInfo?.name || "",
        clientId: currentUser._id.toString(),
        clientEmail: currentUser.email,
        clientName: currentUser.name || formData.name,
        firstMessage: formData.message,
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setMessageSent(true);
    } catch {
      Swal.fire("Error", "Failed to send message.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <DetailsSkeleton />;

  if (error || !property) return (
    <div className="text-center py-20 text-red-500">
      <p>Property not found.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">Go back</button>
    </div>
  );

  const tabs = ["overview", "interior"];

  return (
    <div className="bg-gray-50 min-h-screen dm-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

        {/* Top Nav */}
        <div className="flex items-center justify-between mb-6 mt-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to listing
          </button>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition text-sm">
              <Heart size={16} className="text-gray-500" /> Save
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition text-sm">
              <Share2 size={16} className="text-gray-500" /> Share
            </button>
          </div>
        </div>

        {/* Deal Status Banner */}
        {dealBanner && (
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl mb-6 text-sm font-medium ${dealBanner.color}`}>
            {dealBanner.icon}
            {dealBanner.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/*  LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Gallery */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-[320px] md:h-[420px]">
                <img
                  src={cloudinaryUrl(property.images?.[activeImage], { width: 900 })}
                  alt={property.title}
                  className={`w-full h-full object-cover ${property.dealStatus === "deal_closed" ? "grayscale opacity-80" : ""}`}
                />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${property.listingType === "rent" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"
                  }`}>
                  {property.listingType}
                </span>
                {property.dealStatus === "deal_closed" && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-500/90 text-white">
                    Closed
                  </span>
                )}
                {property.dealStatus === "negotiating" && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase bg-yellow-600 text-white">
                    Under Negotiation
                  </span>
                )}
              </div>

              {property.images?.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition ${activeImage === idx ? "border-indigo-500" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                    >
                      <img src={cloudinaryUrl(img, { width: 200 })} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>


            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
                <span className="text-2xl font-bold text-indigo-600 whitespace-nowrap">
                  {formatPrice(property.price)}
                  {property.listingType === "rent" && (
                    <span className="text-sm font-normal text-gray-400 ml-1">/month</span>
                  )}
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={14} /> {property.address}, {property.city}, {property.state} {property.zipCode}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
              {[
                { icon: <Home size={18} className="text-indigo-500" />, label: "Type", value: property.propertyType },
                { icon: <Bed size={18} className="text-indigo-500" />, label: "Bedrooms", value: `${property.bedrooms} Beds` },
                { icon: <Bath size={18} className="text-indigo-500" />, label: "Bathrooms", value: `${property.bathrooms} Baths` },
                { icon: <Ruler size={18} className="text-indigo-500" />, label: "Area", value: `${property.sqft} sqft` },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {s.icon}
                  <div>
                    <p className="text-xs text-gray-400">{s.label}</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Property Details</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {showFullDescription ? property.description : `${property.description?.slice(0, 300)}...`}
              </p>
              {property.description?.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-indigo-600 text-sm mt-2 hover:underline font-medium"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex gap-1 p-3 border-b border-gray-100 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-5">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { title: "Bedrooms", lines: [`Total: ${property.bedrooms}`, `Main level: ${property.bedrooms}`] },
                      { title: "Bathrooms", lines: [`Total: ${property.bathrooms}`, `Full baths: ${property.bathrooms}`] },
                      { title: "Other rooms", lines: ["Living room", "Bonus room"] },
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <p className="font-semibold text-gray-800 text-sm mb-2">{item.title}</p>
                        {item.lines.map((l, j) => (
                          <p key={j} className="text-xs text-gray-500 leading-relaxed">{l}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "interior" && (
                  <div className="grid grid-cols-2 gap-3">
                    {property.images?.slice(0, 4).map((img, i) => (
                      <img key={i} src={cloudinaryUrl(img, { width: 400 })} loading="lazy" alt="" className="h-36 w-full object-cover rounded-xl" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right — Contact Card  */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {
              agent ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">

                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User size={18} className="text-indigo-600" /> Contact Agent
                  </h3>

                  {/* Agent Info */}
                  {agentName && (
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                      <div className="w-11 h-11 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold flex-shrink-0">
                        {agentInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{agentName}</p>
                        {agentEmail && <p className="text-xs text-gray-400">{agentEmail}</p>}
                      </div>
                    </div>
                  )}

                  {/* deal closed */}
                  {property.dealStatus === "deal_closed" ? (
                    <div className="text-center py-6">
                      <Ban size={32} className="text-red-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-600">This property is no longer available.</p>
                      <p className="text-xs text-gray-400 mt-1">The deal has been closed.</p>
                    </div>

                  ) : messageSent ? (
                    //  Message sent state 
                    <div className="text-center py-6 space-y-4">
                      <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
                        <MessageSquare size={24} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Message sent!</p>
                        <p className="text-xs text-gray-400 mt-1">The agent will contact you soon.</p>
                      </div>
                      <button
                        onClick={() => navigate("/dashboard/my-conversations")}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                      >
                        <MessageSquare size={15} /> View Conversation
                      </button>
                    </div>

                  ) : (
                    //  Contact Form 
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {[
                        { name: "name", label: "Complete Name", icon: <User size={15} className="text-gray-400" />, type: "text", placeholder: "Your full name" },
                        { name: "email", label: "Email", icon: <Mail size={15} className="text-gray-400" />, type: "email", placeholder: "your@email.com" },
                        { name: "phone", label: "Contact Number", icon: <Phone size={15} className="text-gray-400" />, type: "tel", placeholder: "Your mobile number" },
                      ].map(field => (
                        <div key={field.name}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">{field.label} *</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2">{field.icon}</span>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm ${formErrors[field.name] ? "border-red-300 bg-red-50" : "border-gray-200"
                                } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition`}
                            />
                          </div>
                          {formErrors[field.name] && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                              <AlertCircle size={11} /> {formErrors[field.name]}
                            </p>
                          )}
                        </div>
                      ))}

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="I'm interested in this property..."
                          className={`w-full px-4 py-2.5 rounded-xl border resize-none text-sm ${formErrors.message ? "border-red-300 bg-red-50" : "border-gray-200"
                            } focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition`}
                        />
                        {formErrors.message && (
                          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={11} /> {formErrors.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || isStarting}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-70"
                      >
                        {(isSubmitting || isStarting)
                          ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          : <Send size={16} />}
                        {(isSubmitting || isStarting) ? "Sending..." : "Send Message"}
                      </button>

                      <p className="text-xs text-gray-400 text-center leading-relaxed">
                        By submitting, you agree that we and our partners may contact you via call or text.
                        See our <span className="text-red-400">Terms of Service</span> and <span className="text-red-400">Privacy Policy</span>.
                      </p>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      No Agents Available
                    </h3>
                    <p className="mt-2 max-w-md text-sm text-gray-500">
                      Please check back later or apply to become an agent.
                    </p>
                  </div>
                </div>
              )
            }


            {/* Map */}
            <div>
              <PropertyMap
                address={property.address}
                city={property.city}
                propertyTitle={property.title}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;