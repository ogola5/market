import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'https://marketing-app-1.onrender.com';

export const CampaignModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    campaign_type: '',
    style: 'persuasive',
    custom_prompt: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState(null);

  const campaignTypes = [
    { value: 'email', label: 'Email Sequence' },
    { value: 'social_media', label: 'Social Media Posts' },
    { value: 'direct_message', label: 'Direct Messages' }
  ];

  const styles = [
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'aggressive', label: 'Aggressive' },
    { value: 'funny', label: 'Funny' },
    { value: 'educational', label: 'Educational' }
  ];

  const handleGenerate = async () => {
    if (!formData.campaign_type) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API}/api/campaigns/generate`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGeneratedCampaign(response.data.campaign);
    } catch (error) {
      console.error('Campaign generation failed:', error);
      alert('Failed to generate campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Generate AI Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!generatedCampaign ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Campaign Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {campaignTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, campaign_type: type.value })}
                      className={`p-4 border-2 rounded-lg ${
                        formData.campaign_type === type.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Style</label>
                <div className="grid grid-cols-4 gap-4">
                  {styles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setFormData({ ...formData, style: style.value })}
                      className={`p-3 border-2 rounded-lg ${
                        formData.style === style.value
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!formData.campaign_type || loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg"
              >
                {loading ? 'Generating...' : 'Generate Campaign'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800">Campaign Generated Successfully!</h3>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">{generatedCampaign.title}</h3>
                <pre className="bg-gray-50 border rounded-lg p-4 whitespace-pre-wrap">
                  {generatedCampaign.content}
                </pre>
              </div>
              <button onClick={onSuccess} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                Save Campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};