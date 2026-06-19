import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize,
  Upload,
  X,
  Check,
  Building2,
  Calendar,
  Tag,
  FileText,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAddProperty from '../../../../../hooks/property/useAddProperty';

const AddProperty = () => {
  const { mutateAsync } = useAddProperty();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'rent', 
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    featured: false,

  });
  const initialFromState = {
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'rent', 
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    featured: false,


  }
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: <Building2 size={16} /> },
    { value: 'house', label: 'House', icon: <Home size={16} /> },
    { value: 'condo', label: 'Condo', icon: <Building2 size={16} /> },
    { value: 'land', label: 'Land', icon: <MapPin size={16} /> },
    { value: 'commercial', label: 'Commercial', icon: <Building2 size={16} /> },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      Swal.fire('Limit reached', 'You can upload up to 10 images.', 'warning');
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.bedrooms) newErrors.bedrooms = 'Bedrooms required';
    if (!formData.bathrooms) newErrors.bathrooms = 'Bathrooms required';
    if (!formData.sqft) newErrors.sqft = 'Square feet required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire('Validation Error', 'Please fill all required fields.', 'error');
      return;
    }

    setLoading(true);

    try {
      await mutateAsync({
        ...formData,
        images, // file array
      });

      Swal.fire('Success!', 'Property has been added successfully.', 'success');
      setFormData(initialFromState)
      setImages([]);

      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews([])
      setErrors({});
      // navigate('/rent');

    } catch (error) {
      Swal.fire('Error', 'Something went wrong. Please try again.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dm-sans p-4 md:p-6 lg:p-8">
      <div className='mb-7'>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>
      </div>
      {/* Header */}
      <div className='items-center flex justify-between mb-8'>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-500 mt-1">Fill in the details to list your property</p>
        </div>


      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Home size={20} className="text-indigo-600" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Modern Beachfront Villa"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type *</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, listingType: 'rent' }))}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${formData.listingType === 'rent' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Rent
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, listingType: 'buy' }))}
                  className={`flex-1 py-2.5 rounded-xl font-medium transition ${formData.listingType === 'buy' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                 Buy
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-indigo-600" /> Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Bed size={14} /> Bedrooms *</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.bedrooms && <p className="text-red-500 text-xs">{errors.bedrooms}</p>}
            </div>
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Bath size={14} /> Bathrooms *</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.bathrooms && <p className="text-red-500 text-xs">{errors.bathrooms}</p>}
            </div>
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Maximize size={14} /> Area (sq ft) *</label>
              <input type="number" name="sqft" value={formData.sqft} onChange={handleChange} placeholder="e.g., 1200" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.sqft && <p className="text-red-500 text-xs">{errors.sqft}</p>}
            </div>
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Calendar size={14} /> Year Built</label>
              <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} placeholder="e.g., 2015" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FileText size={14} /> Description *</label>
              <textarea rows={3} name="description" value={formData.description} onChange={handleChange} placeholder="Describe the property, features, neighborhood..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none resize-none" />
              {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-indigo-600" /> Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="New York" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="NY" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
              <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="10001" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 outline-none" />
              {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode}</p>}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Upload size={20} className="text-indigo-600" /> Property Images
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition cursor-pointer" onClick={() => document.getElementById('imageUpload').click()}>
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">Click or drag images to upload</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB (max 10 images)</p>
            <input id="imageUpload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
          {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative group">
                  <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                  <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
            <span className="text-gray-700">Feature this property (highlighted in search results)</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check size={18} />}
            {loading ? 'Adding...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;