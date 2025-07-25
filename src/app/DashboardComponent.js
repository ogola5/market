import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthComponent';
import { CampaignModal } from './CampaignModal';

const API = process.env.REACT_APP_BACKEND_URL || 'https://marketing-app-1.onrender.com';

export const DashboardComponent = () => {
  const { user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchCampaigns();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.get(`${API}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(resp.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setDashboardData(null);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.get(`${API}/api/campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = resp.data;
      if (data && Array.isArray(data.data)) {
        setCampaigns(data.data);
      } else {
        console.warn('Unexpected campaigns data shape:', data);
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav Bar */}
      <nav className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">AI Marketing Agent</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.name}</span>
            <button onClick={logout} className="text-gray-500 hover:text-gray-700">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card title="Total Campaigns" value={dashboardData?.campaigns_count ?? 0} />
          <Card title="Total Leads" value={dashboardData?.leads_count ?? 0} />
          <Card title="Hot Leads" value={dashboardData?.leads_by_status?.hot ?? 0} />
          <Card title="Warm Leads" value={dashboardData?.leads_by_status?.warm ?? 0} />
        </div>

        {/* Generate Campaign Button */}
        <button
          onClick={() => setShowCampaignForm(true)}
          className="mb-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Generate New Campaign
        </button>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Your Campaigns</h2>
          </div>
          <div className="p-6 space-y-4">
            {campaigns.length === 0 ? (
              <p className="text-center text-gray-600">No campaigns yet. Create your first campaign!</p>
            ) : (
              campaigns.slice(0, 5).map((c) => (
                <div key={c.id || c._id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <div className="mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{c.title || 'Untitled Campaign'}</h3>
                    <p className="text-sm text-gray-500">{c.campaign_type} • {c.style}</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {c.content || c.description || 'No generated content available.'}
                    </p>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                    {c.status || 'draft'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCampaignForm && (
        <CampaignModal
          onClose={() => setShowCampaignForm(false)}
          onSuccess={() => {
            setShowCampaignForm(false);
            fetchCampaigns();
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

// Reusable stat card
const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <p className="text-sm font-medium text-gray-600">{title}</p>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);