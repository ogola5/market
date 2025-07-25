// src/components/OnboardingComponent.js
"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthComponent';

// CORRECTED: API should only contain the base URL to your backend
// The full path will be constructed when making the request.
const API = process.env.REACT_APP_BACKEND_URL || 'https://marketing-app-1.onrender.com/'; 

export const OnboardingComponent = () => {
  const { user, fetchProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    business_type: '',
    industry: '',
    product_service: '',
    target_audience: '',
    campaign_goal: ''
  });
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: 'Business Type',
      question: 'What type of business do you run?',
      field: 'business_type',
      options: ['Startup', 'Small Business', 'Agency', 'Freelancer', 'Enterprise', 'Non-profit']
    },
    {
      title: 'Industry',
      question: 'What industry are you in?',
      field: 'industry',
      options: ['Technology', 'Healthcare', 'E-commerce', 'Consulting', 'Education', 'Finance', 'Real Estate', 'Other']
    },
    {
      title: 'Product/Service',
      question: 'What do you offer?',
      field: 'product_service',
      type: 'textarea'
    },
    {
      title: 'Target Audience',
      question: 'Who is your target audience?',
      field: 'target_audience',
      type: 'textarea'
    },
    {
      title: 'Campaign Goal',
      question: 'What is your primary marketing goal?',
      field: 'campaign_goal',
      options: ['Generate Leads', 'Increase Sales', 'Brand Awareness', 'Customer Retention', 'Product Launch', 'Website Traffic']
    }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // CORRECTED: Build the full path using the base API and the correct endpoint
      await axios.post(`${API}/api/auth/onboarding`, formData, { // THIS IS THE KEY CHANGE
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchProfile(); // This will re-fetch the user profile, which should now show onboarding_completed: true
    } catch (error) {
      console.error('Onboarding failed:', error);
      alert('Onboarding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
            <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentStepData.question}</h2>
          
          {currentStepData.options ? (
            <div className="space-y-3">
              {currentStepData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setFormData({ ...formData, [currentStepData.field]: option })}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                    formData[currentStepData.field] === option
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              value={formData[currentStepData.field]}
              onChange={(e) => setFormData({ ...formData, [currentStepData.field]: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none h-32"
              placeholder="Enter your answer..."
            />
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={() => currentStep === steps.length - 1 ? handleSubmit() : setCurrentStep(currentStep + 1)}
            disabled={!formData[currentStepData.field] || loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg"
          >
            {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};