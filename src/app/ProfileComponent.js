"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthComponent';
import useApi from './useApi';

export const ProfileComponent = () => {
  const { user, fetchProfile } = useAuth();
  const api = useApi();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await api.put('/api/profile', { name, email });
    if (res.success) {
      await fetchProfile();
    }
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <div className="space-y-4">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          className="w-full border p-2 rounded"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};