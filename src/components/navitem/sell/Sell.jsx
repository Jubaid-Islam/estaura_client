import React, { useState } from 'react';
import {
  CheckCircle, Home, MapPin, Image as ImageIcon,
  UserCheck, DollarSign, Maximize, Bed, Bath,
  Calendar, FileText, X, Loader2, Check,
  TrendingUp,
  BadgeCheck,
  ChevronsUp,
  ArrowRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../axios/useAxiosSecure';
import { submitProperty } from '../../../api/PropertyApi';

const STEPS = [
  { id: 1, label: 'Property Basics', icon: Home },
  { id: 2, label: 'Location & Media', icon: MapPin },
  { id: 3, label: 'Review & Submit', icon: UserCheck },
];

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

const Sell = () => {
  const axiosSecure = useAxiosSecure();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'buy',
    price: '',
    sqft: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: '',
    featured: false,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    agentId: '',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 10) {
      Swal.fire('Limit reached', 'Max 10 images allowed.', 'warning');
      return;
    }
    setImageFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.sqft) newErrors.sqft = 'SQFT is required';
      if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms required';
      if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    }
    if (s === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
      if (imageFiles.length === 0) newErrors.images = 'At least one image required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitProperty(axiosSecure, { ...formData, images: imageFiles });
      Swal.fire({
        icon: 'success',
        title: 'Property Submitted!',
        text: 'Your property is under review. Admin will approve it shortly.',
        showConfirmButton: false,
        timer: 2500,
      });
      // form reset
      setFormData({
        title: '', description: '', propertyType: 'apartment',
        listingType: 'sell', price: '', sqft: '', bedrooms: '',
        bathrooms: '', yearBuilt: '', featured: false,
        address: '', city: '', state: '', zipCode: '', agentId: '',
      });
      setImageFiles([]);
      setStep(1);
    } catch (error) {
      Swal.fire('Error', 'Something went wrong. Please try again.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMsg = ({ field }) => errors[field]
    ? <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    : null;

  return (
    <div className="min-h-screen pb-20 dm-sans mt-20">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          List Your <span className="text-indigo-600">Property</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Get maximum market value with zero hassle. Fill in the details below.
        </p>

        {/* Step Progress */}
        <div className="flex justify-center items-center mt-8 gap-3 max-w-lg mx-auto">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step > s.id ? 'bg-indigo-600 text-white' :
                  step === s.id ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                  {step > s.id ? <CheckCircle size={18} /> : s.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step === s.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-16 md:w-24 mb-4 transition-all ${step > s.id ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-10 px-4">

      
        {step === 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Home size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">Property Basics</h2>
            </div>

            {/* Title */}
            <div>
              <label className={labelClass}>Property Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Modern Apartment in Gulshan" className={inputClass} />
              <ErrorMsg field="title" />
            </div>

            {/* Listing Type */}
            <div>
              <label className={labelClass}>Listing Type *</label>
              <div className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-indigo-600 font-medium ">
                Sell
              </div>
              {/* for admin-> Buy */}
              <input type="hidden" name="listingType" value="Buy" />  
            </div>

            {/* Property Type */}
            <div>
              <label className={labelClass}>Property Type *</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} className={inputClass}>
                {['apartment', 'house', 'condo', 'land', 'commercial'].map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Price , SQFT */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}><DollarSign size={13} className="inline mr-1" />Price *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 1200" className={inputClass} />
                <ErrorMsg field="price" />
              </div>
              <div>
                <label className={labelClass}><Maximize size={13} className="inline mr-1" />SQFT *</label>
                <input type="number" name="sqft" value={formData.sqft} onChange={handleChange} placeholder="e.g. 1200" className={inputClass} />
                <ErrorMsg field="sqft" />
              </div>
            </div>

            {/* Beds , Baths , Year */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelClass}><Bed size={13} className="inline mr-1" />Beds *</label>
                <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="3" className={inputClass} />
                <ErrorMsg field="bedrooms" />
              </div>
              <div>
                <label className={labelClass}><Bath size={13} className="inline mr-1" />Baths *</label>
                <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="2" className={inputClass} />
                <ErrorMsg field="bathrooms" />
              </div>
              <div>
                <label className={labelClass}><Calendar size={13} className="inline mr-1" />Year Built</label>
                <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} placeholder="2020" className={inputClass} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}><FileText size={13} className="inline mr-1" />Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe your property..." className={`${inputClass} resize-none`} />
              <ErrorMsg field="description" />
            </div>

            {/* Featured */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
              <span className="text-sm text-gray-600">Feature this property (highlighted in search)</span>
            </label>

            <button onClick={handleNext} className="group flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold  transition duration-200 shadow-md">
              Next
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform " />
            </button>
          </div>
        )}

      
        {step === 2 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">Location & Media</h2>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Street Address *</label>
              <input name="address" value={formData.address} onChange={handleChange} placeholder="e.g. 12 Gulshan Ave" className={inputClass} />
              <ErrorMsg field="address" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City *</label>
                <input name="city" value={formData.city} onChange={handleChange} placeholder="Dhaka" className={inputClass} />
                <ErrorMsg field="city" />
              </div>
              <div>
                <label className={labelClass}>State *</label>
                <input name="state" value={formData.state} onChange={handleChange} placeholder="Dhaka Division" className={inputClass} />
                <ErrorMsg field="state" />
              </div>
            </div>

            <div>
              <label className={labelClass}>ZIP Code *</label>
              <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="1212" className={`${inputClass} w-1/2`} />
              <ErrorMsg field="zipCode" />
            </div>

            {/* Image Upload */}
            <div>
              <label className={labelClass}>Property Images * (max 10)</label>

              {/* Preview */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img src={URL.createObjectURL(file)} alt="" className="h-20 w-full object-cover rounded-xl border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Zone */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-400 transition cursor-pointer"
                onClick={() => document.getElementById('imgUpload').click()}
              >
                <ImageIcon size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Click to upload images</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                <input id="imgUpload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <ErrorMsg field="images" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition">
                ← Back
              </button>
              <button onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-md">
                Next
              </button>
            </div>
          </div>
        )}

    
        {step === 3 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-800">Review & Submit</h2>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Title</span><span className="font-medium text-gray-800">{formData.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Property type</span><span className="font-medium capitalize text-gray-800">{formData.propertyType} </span></div>
              <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-bold text-indigo-600">${Number(formData.price).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="font-medium text-gray-800">{formData.city}, {formData.state}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Beds / Baths</span><span className="font-medium text-gray-800">{formData.bedrooms} / {formData.bathrooms}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Images</span><span className="font-medium text-gray-800">{imageFiles.length} uploaded</span></div>
            </div>

      
            <div></div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                  : <><Check size={18} /> Submit Property</>
                }
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Sell;
