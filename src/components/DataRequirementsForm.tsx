import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

const DataRequirementsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    roleTitle: "",
    dataType: "",
    dataAmount: "",
    timeline: "",
    hardwareSetup: [] as string[],
    additionalHardware: "",
    budgetRange: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      hardwareSetup: checked 
        ? [...prev.hardwareSetup, value]
        : prev.hardwareSetup.filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.company) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for Supabase (convert camelCase to snake_case)
      const dataToSubmit = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        role_title: formData.roleTitle || null,
        data_type: formData.dataType || null,
        data_amount: formData.dataAmount || null,
        timeline: formData.timeline || null,
        hardware_setup: formData.hardwareSetup.length > 0 ? formData.hardwareSetup : null,
        additional_hardware: formData.additionalHardware || null,
        budget_range: formData.budgetRange || null
      };

      // Submit to Supabase
      const { data, error } = await supabase
        .from('data_requirements')
        .insert([dataToSubmit])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // Check if it's a configuration error
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          toast.error("Database configuration error. Please ensure the table is created in Supabase.");
        } else if (error.message.includes('Failed to fetch')) {
          toast.error("Connection error. Please check your Supabase configuration.");
        } else {
          toast.error("Failed to submit form. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success("Your data requirements have been submitted! We'll get back to you within 24 hours.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        roleTitle: "",
        dataType: "",
        dataAmount: "",
        timeline: "",
        hardwareSetup: [],
        additionalHardware: "",
        budgetRange: ""
      });
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const hardwareOptions = [
    "UMI",
    "ALOHA",
    "Webcam",
    "Smartphone",
    "Computer (Keyboard and Mouse)",
    "Space Mouse",
    "VR",
    "Custom Manipulator",
    "Mobile Robot",
    "Depth Cameras",
    "Other (please specify)"
  ];

  return (
    <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
      {/* Card Header */}
      <div className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col items-start" style={{
        backgroundImage: "url('/background-section1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4">
          Data Collection Services
        </div>
        <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto">
          Tell Us About Your Data Needs
        </h2>
      </div>
      
      {/* Card Content - Form */}
      <div className="bg-white p-4 sm:p-8" style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #ECECEC"
      }}>
        <p className="text-gray-600 mb-6">Share your requirements and we'll get back to you within 24 hours.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input 
                type="text" 
                id="fullName"
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                placeholder="John Smith" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address *
              </label>
              <input 
                type="email" 
                id="email"
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="john.smith@company.com" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone number *
              </label>
              <input 
                type="tel" 
                id="phone"
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+1 (555) 123-4567" 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input 
                type="text" 
                id="company"
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Acme Robotics Inc." 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Role/Title (optional)
              </label>
              <input 
                type="text" 
                id="roleTitle"
                name="roleTitle" 
                value={formData.roleTitle} 
                onChange={handleChange} 
                placeholder="ML Engineer, Robotics Lead, etc." 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
              />
            </div>
          </div>

          {/* Data Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Requirements</h3>
            
            <div>
              <label htmlFor="dataType" className="block text-sm font-medium text-gray-700 mb-2">
                What type of data do you need?
              </label>
              <textarea 
                id="dataType"
                name="dataType" 
                value={formData.dataType} 
                onChange={handleChange} 
                placeholder="E.g., 'Bimanual manipulation data of robots assembling electronics'" 
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
              />
            </div>
            
            <div>
              <label htmlFor="dataAmount" className="block text-sm font-medium text-gray-700 mb-2">
                How much data do you need?
              </label>
              <textarea 
                id="dataAmount"
                name="dataAmount" 
                value={formData.dataAmount} 
                onChange={handleChange} 
                placeholder="E.g., '5,000 successful demonstrations with diverse object configurations'" 
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
              />
            </div>
            
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                When do you need the data by?
              </label>
              <textarea 
                id="timeline"
                name="timeline" 
                value={formData.timeline} 
                onChange={handleChange} 
                placeholder="E.g., 'Within 6 weeks for our next training cycle'" 
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
              />
            </div>

            {/* Hardware Setup Checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What hardware setup is required?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {hardwareOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.hardwareSetup.includes(option)}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-pulse-500 focus:ring-pulse-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="additionalHardware" className="block text-sm font-medium text-gray-700 mb-2">
                Additional hardware requirements
              </label>
              <textarea 
                id="additionalHardware"
                name="additionalHardware" 
                value={formData.additionalHardware} 
                onChange={handleChange} 
                placeholder="Describe any specific sensors, tools, or equipment needed" 
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
              />
            </div>

            <div>
              <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-2">
                What's your budget range?
              </label>
              <select 
                id="budgetRange"
                name="budgetRange" 
                value={formData.budgetRange} 
                onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent"
              >
                <option value="">Select budget range</option>
                <option value="under-10k">Under $10k</option>
                <option value="10k-50k">$10k-$50k</option>
                <option value="50k-100k">$50k-$100k</option>
                <option value="100k-plus">$100k+</option>
                <option value="discuss">Let's discuss</option>
              </select>
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full px-6 py-3 text-white font-medium rounded-full transition-colors duration-300 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-pulse-500 hover:bg-pulse-600'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataRequirementsForm;