// src/components/CampaignComponent.jsx
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CampaignModal } from './CampaignModal';

const API = process.env.REACT_APP_BACKEND_URL || 'https://marketing-app-1.onrender.com';

const CampaignComponent = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(res.data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalSuccess = () => {
    setShowModal(false);
    fetchCampaigns(); // refresh after new campaign
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Campaigns</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-gray-600">No campaigns yet. Start by creating one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                {campaign.title || 'Untitled Campaign'}
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap overflow-hidden line-clamp-4">
                {campaign.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CampaignModal onClose={handleModalClose} onSuccess={handleModalSuccess} />
      )}
    </div>
  );
};

export default CampaignComponent;