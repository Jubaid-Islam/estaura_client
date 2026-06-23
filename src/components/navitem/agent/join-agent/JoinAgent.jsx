import React, { useState } from 'react';
import {
  Phone, MapPin, Briefcase,
  FileText, Mail, User, ArrowRight, ArrowLeft,
  CheckCircle, Loader2, Building2,
} from 'lucide-react';
import Swal from 'sweetalert2';
import useUser from '../../../../hooks/user/useUser';
import { useSubmitApplication } from '../../../../hooks/agentApplication/useAgentApplication';
import { useNavigate } from 'react-router';

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm bg-white";
const labelClass = "block text-xs font-medium text-gray-600 mb-1.5";

const specializations = [
  'Residential', 'Commercial', 'Luxury',
  'Land & Plot', 'Industrial', 'Rental', 'Investment',
];

const JoinAgent = () => {
  const { data: currentUser } = useUser();
  const { submitApplication, isPending } = useSubmitApplication();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    phone: '', city: '', experience: '', specialization: '', bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.experience) newErrors.experience = 'Years of experience is required';
    if (!formData.specialization) newErrors.specialization = 'Please select a specialization';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    else if (formData.bio.trim().length < 20) newErrors.bio = 'Bio must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await submitApplication({
        userId: currentUser?._id,
        name: currentUser?.name,
        email: currentUser?.email,
        phone: formData.phone,
        city: formData.city,
        experience: Number(formData.experience),
        specialization: formData.specialization,
        bio: formData.bio,
        status: 'pending',
        appliedAt: new Date(),
      });
      setSubmitted(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission failed',
        text: error?.response?.data?.message || 'Something went wrong. Please try again.',
        customClass: { popup: 'rounded-2xl' },
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dm-sans mt-20">

      {/* Hero */}
      <div className="bg-white">
        <div className="border-b border-gray-100 md:py-14 py-1 px-6 text-center max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex justify-start items-center gap-2 font-medium text-sm text-gray-600 hover:text-indigo-600 transition group mb-10 mt-4"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Become an <span className="text-indigo-600">Agent</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Join our network of real estate professionals. Get assigned premium properties and grow your career with our platform.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Application submitted!</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                We've received your application. Our admin team will review it within 48 hours and update your account status.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-base font-bold text-gray-800 mb-6">Agent application</h2>

              {/* Pre-filled info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="text-sm font-medium text-gray-800">{currentUser?.name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{currentUser?.email || '—'}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Phone + City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      <Phone size={12} className="inline mr-1" /> Phone number *
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1700-000000"
                      className={inputClass}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>
                      <MapPin size={12} className="inline mr-1" /> City *
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Dhaka"
                      className={inputClass}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                </div>

                {/* Experience + Specialization */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      <Briefcase size={12} className="inline mr-1" /> Years of experience *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select...</option>
                      {['0–1', '1–3', '3–5', '5–10', '10+'].map((y, i) => (
                        <option key={i} value={i === 0 ? 0 : i}>{y} years</option>
                      ))}
                    </select>
                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Building2 size={12} className="inline mr-1" /> Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select...</option>
                      {specializations.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className={labelClass}>
                    <FileText size={12} className="inline mr-1" /> Professional bio *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your real estate experience, achievements, and what makes you a great agent."
                    className={`${inputClass} resize-none`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.bio
                      ? <p className="text-red-500 text-xs">{errors.bio}</p>
                      : <span />
                    }
                    <p className={`text-xs ml-auto ${formData.bio.length < 20 ? 'text-gray-300' : 'text-emerald-500'}`}>
                      {formData.bio.length}/20 min
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-gray-400">Reviewed within 48 hours.</p>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-100 disabled:opacity-70"
                  >
                    {isPending
                      ? <><Loader2 size={15} className="animate-spin" /> Submitting...</>
                      : <>Submit <ArrowRight size={15} /></>
                    }
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinAgent;