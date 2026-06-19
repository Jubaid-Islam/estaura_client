import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Name is required';
    if (!formData.email.trim())   newErrors.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white ${
      errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`;

  const contacts = [
    { icon: <MapPin size={16} className="text-indigo-500" />, label: 'Address', value: 'Chattogram, Bangladesh' },
    { icon: <Phone size={16} className="text-indigo-500" />, label: 'Phone', value: '+8801700-000000' },
    { icon: <Mail size={16} className="text-indigo-500" />, label: 'Email', value: 'jubaid2006@gmail.com' },
    { icon: <Clock size={16} className="text-indigo-500" />, label: 'Hours', value: 'Sun – Thu, 9:00 AM – 6:00 PM' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen dm-sans mt-20">

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-14 px-6 text-center">
        <span className="inline-block px-3 py-1 bg-gray-100/70 text-indigo-600 text-xs font-semibold rounded-full mb-4">
          Get in touch
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          We'd love to hear from you
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Have a question about a property or need help finding your dream home? Our team is here to help.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — info */}
        <div className="space-y-5">

          {/* Contact info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-gray-800">Contact information</h2>
            {contacts.map((c, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{c.label}</p>
                  <p className="text-sm text-gray-700 font-medium mt-0.5">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

        
        </div>

        {/* Right — form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                className="mt-6 px-5 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-gray-800 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name , Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Full name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={inputClass('name')} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Email address *</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputClass('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone , Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+880 1700-000000" className={inputClass('phone')} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Subject *</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className={inputClass('subject')}>
                      <option value="">Select a topic...</option>
                      <option value="property">Property inquiry</option>
                      <option value="agent">Agent inquiry</option>
                      <option value="listing">List my property</option>
                      <option value="support">General support</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={`${inputClass('message')} resize-none`}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-gray-400">We reply within 24 hours.</p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-indigo-100 disabled:opacity-70"
                  >
                    {isSubmitting
                      ? <><Loader2 size={16} className="animate-spin" /> Sending...</>
                      : <><Send size={15} /> Send message</>
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

export default Contact;