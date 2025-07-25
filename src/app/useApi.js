import { useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL || 'https://marketing-app-1.onrender.com';

const useApi = () => {
  const getToken = () => localStorage.getItem('token');

  const request = useCallback(async (method, url, data = null) => {
    try {
      const res = await axios({
        method,
        url: `${API}${url}`,
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        data
      });
      return { success: true, data: res.data };
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error };
    }
  }, []);

  return {
    get: url => request('get', url),
    post: (url, data) => request('post', url, data),
    put: (url, data) => request('put', url, data),
    del: url => request('delete', url)
  };
};

export default useApi;