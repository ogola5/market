// // src/components/AuthComponent.js
// "use client";
// import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
// import axios from 'axios';

// // --- Configuration ---
// const API_URL = process.env.REACT_APP_API_URL || 'https://marketing-app-1.onrender.com/api'; // Ensure this matches your backend prefix
// axios.defaults.baseURL = API_URL;
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// console.log('AuthComponent: API_URL set to', API_URL);
// // --- NEW DEBUG LOG: Log the full URL as soon as the component file is loaded ---
// console.log('AuthComponent: Current window.location.href on load:', window.location.href);

// // --- Context Definition ---
// const AuthContext = createContext();

// // --- Local Storage Utilities ---
// // Using localStorage for persistence across browser tabs
// const TOKEN_KEY = 'auth_token';
// const USER_KEY = 'auth_user';

// const storage = {
//   getToken: () => {
//     const token = localStorage.getItem(TOKEN_KEY);
//     console.log('AuthComponent storage: getToken called. Found token:', token ? 'YES' : 'NO');
//     return token;
//   },
//   setToken: (token) => {
//     localStorage.setItem(TOKEN_KEY, token);
//     console.log('AuthComponent storage: setToken called. Token set.');
//   },
//   getUser: () => {
//     const userStr = localStorage.getItem(USER_KEY);
//     const user = userStr ? JSON.parse(userStr) : null;
//     console.log('AuthComponent storage: getUser called. Found user:', user ? 'YES' : 'NO');
//     return user;
//   },
//   setUser: (user) => {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//     console.log('AuthComponent storage: setUser called. User set.');
//   },
//   clear: () => {
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     console.log('AuthComponent storage: clear called. Local storage cleared.');
//   }
// };

// // --- Axios Interceptors ---
// // Request interceptor to add the auth token to every request
// axios.interceptors.request.use(
//   (config) => {
//     const token = storage.getToken(); // getToken already logs
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       // console.log('AuthComponent Axios Interceptor: Adding Authorization header.');
//     } else {
//       // console.log('AuthComponent Axios Interceptor: No token found, no Authorization header added.');
//     }
//     return config;
//   },
//   (error) => {
//     console.error('AuthComponent Axios Interceptor: Request error:', error);
//     return Promise.reject(error);
//   }
// );

// // --- Auth Provider Component ---
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   console.log('AuthComponent AuthProvider render: user state:', user, 'loading:', loading, 'error:', error);


//   // Function to fetch the user profile if a token exists
//   const fetchUserProfile = useCallback(async () => {
//     console.log('AuthComponent fetchUserProfile: Attempting to fetch user profile...');
//     try {
//       const { data } = await axios.get('/auth/profile');
//       storage.setUser(data); // setUser already logs
//       setUser(data);
//       console.log('AuthComponent fetchUserProfile: User profile fetched successfully:', data);
//       return data; // Return user data on success
//     } catch (err) {
//       console.error('AuthComponent fetchUserProfile: Error fetching user profile:', err.response?.data?.detail || err.message, err);
//       // This is expected if the token is invalid or expired
//       storage.clear(); // clear already logs
//       setUser(null);
//       return null; // Return null on failure
//     }
//   }, []); // No dependencies means this function won't change unless its definition changes.

//   // Effect to run on initial component mount and on fetchUserProfile change
//   useEffect(() => {
//     const initAuth = async () => {
//       console.log('AuthComponent useEffect: initAuth started.');
//       setLoading(true);

//       const currentPath = window.location.pathname;
//       const params = new URLSearchParams(window.location.search);
//       const tokenFromUrl = params.get('token');
//       const errorFromUrl = params.get('error');

//       // --- CRITICAL CHANGE: Prioritize Google OAuth callback handling ---
//       // Check if the current path is specifically the Google OAuth callback path
//       if (currentPath === '/auth/google/callback') {
//         console.log('AuthComponent useEffect: Detected Google OAuth callback path:', currentPath);
//         if (errorFromUrl) {
//           setError(`Authentication failed: ${errorFromUrl}`);
//           storage.clear();
//           console.error('AuthComponent useEffect: Auth failed from URL error:', errorFromUrl);
//           // Clean the URL, but crucially, don't redirect yet. Let the PublicRoute handle initial redirect.
//           window.history.replaceState({}, document.title, window.location.pathname);
//         } else if (tokenFromUrl) {
//           console.log('AuthComponent useEffect: Processing token from URL (Google OAuth callback). Token found!');
//           storage.setToken(tokenFromUrl);
//           const fetchedUser = await fetchUserProfile();
//           console.log('AuthComponent useEffect: User fetched after Google callback:', fetchedUser);

//           if (fetchedUser) {
//             const redirectPath = fetchedUser.onboarding_completed ? '/dashboard' : '/onboarding';
//             console.log('AuthComponent useEffect: User authenticated, redirecting to:', redirectPath);
//             // Use window.location.replace for cleaner history, or React Router's navigate
//             window.location.replace(redirectPath); 
//             // Return null to stop further processing in this render cycle
//             return; 
//           } else {
//             console.error('AuthComponent useEffect: Failed to fetch user profile after Google callback, clearing session.');
//             // Session already cleared by fetchUserProfile catch block
//             // Redirect to login if user fetch fails even with a token
//             window.location.replace('/login');
//             return;
//           }
//         } else {
//           // Path is /auth/google/callback but no token/error, unexpected state
//           console.warn('AuthComponent useEffect: Landed on Google callback path without token or error.');
//           storage.clear(); // Clear any potential stale state
//           window.location.replace('/login'); // Redirect to login
//           return;
//         }
//       } 
//       // --- END CRITICAL CHANGE ---

//       // Standard check for an existing token on page load if not a Google callback
//       console.log('AuthComponent useEffect: Not a Google callback path. Checking existing token in localStorage...');
//       const existingToken = storage.getToken();
//       if (existingToken) {
//         console.log('AuthComponent useEffect: Existing token found, attempting to fetch user profile.');
//         await fetchUserProfile();
//       } else {
//         console.log('AuthComponent useEffect: No existing token found. User is not authenticated via existing session.');
//       }
      
//       setLoading(false);
//       console.log('AuthComponent useEffect: initAuth finished. Loading set to false.');
//     };

//     initAuth();
//   }, [fetchUserProfile]); // Depend on fetchUserProfile as it's a useCallback.


//   // --- Authentication Methods ---

//   const login = async (email, password) => {
//     console.log('AuthComponent login: Attempting login for email:', email);
//     try {
//       setError(null);
//       const { data } = await axios.post('/auth/login', { email, password });
//       storage.setToken(data.token); // setToken already logs
//       storage.setUser(data.user); // setUser already logs
//       setUser(data.user);
//       console.log('AuthComponent login: Login successful. User data:', data.user);
//       return { success: true, user: data.user };
//     } catch (err) {
//       const message = err.response?.data?.detail || 'Login failed. Please check your credentials.';
//       setError(message);
//       console.error('AuthComponent login: Login failed:', message, err);
//       return { success: false, error: message };
//     }
//   };

//   const register = async (name, email, password) => {
//     console.log('AuthComponent register: Attempting registration for email:', email, 'name:', name);
//     try {
//       setError(null);
//       const { data } = await axios.post('/auth/register', { name, email, password });
//       storage.setToken(data.token); // setToken already logs
//       storage.setUser(data.user); // setUser already logs
//       setUser(data.user);
//       console.log('AuthComponent register: Registration successful. User data:', data.user);
//       return { success: true, user: data.user };
//     } catch (err) {
//       const message = err.response?.data?.detail || 'Registration failed. Please try again.';
//       setError(message);
//       console.error('AuthComponent register: Registration failed:', message, err);
//       return { success: false, error: message };
//     }
//   };

//   const loginWithGoogle = async () => {
//     console.log('AuthComponent loginWithGoogle: Initiating Google login flow...');
//     try {
//       setError(null);
//       const { data } = await axios.get('/auth/google/login');
//       if (data.auth_url) {
//         console.log('AuthComponent loginWithGoogle: Redirecting to Google auth URL:', data.auth_url);
//         // Redirect the user to Google's authentication page
//         window.location.href = data.auth_url;
//       } else {
//         console.error('AuthComponent loginWithGoogle: No auth_url received from backend.');
//         setError('Could not initiate Google login: No auth_url from server.');
//       }
//     } catch (err) {
//       const message = err.response?.data?.detail || 'Could not initiate Google login.';
//       setError(message);
//       console.error('AuthComponent loginWithGoogle: Error initiating Google login:', message, err);
//     }
//   };

//   const logout = () => {
//     console.log('AuthComponent logout: Logging out user...');
//     storage.clear(); // clear already logs
//     setUser(null);
//     console.log('AuthComponent logout: Redirecting to /login.');
//     // Redirect to home or login page
//     window.location.href = '/login';
//   };

//   const updateProfile = async (profileData) => {
//     console.log('AuthComponent updateProfile: Attempting to update profile...');
//     try {
//       setError(null);
//       await axios.put('/auth/profile', profileData);
//       console.log('AuthComponent updateProfile: Profile updated, refetching user profile for consistency.');
//       // Refresh user data from the backend to ensure consistency
//       await fetchUserProfile(); // fetchUserProfile already logs
//       console.log('AuthComponent updateProfile: Profile update successful.');
//       return { success: true };
//     } catch (err) {
//       const message = err.response?.data?.detail || 'Failed to update profile.';
//       setError(message);
//       console.error('AuthComponent updateProfile: Failed to update profile:', message, err);
//       return { success: false, error: message };
//     }
//   };

//   const completeOnboarding = async (onboardingData) => {
//     console.log('AuthComponent completeOnboarding: Attempting to complete onboarding...');
//     try {
//       setError(null);
//       await axios.post('/auth/onboarding', onboardingData);
//       // Optimistically update the user state or refetch
//       const updatedUser = { ...user, onboarding_completed: true };
//       setUser(updatedUser);
//       storage.setUser(updatedUser); // setUser already logs
//       console.log('AuthComponent completeOnboarding: Onboarding completed successfully.');
//       return { success: true };
//     } catch (err) {
//       const message = err.response?.data?.detail || 'Failed to complete onboarding.';
//       setError(message);
//       console.error('AuthComponent completeOnboarding: Failed to complete onboarding:', message, err);
//       return { success: false, error: message };
//     }
//   };

//   // --- Context Value ---
//   const contextValue = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     loginWithGoogle,
//     logout,
//     updateProfile,
//     completeOnboarding,
//     isAuthenticated: !!user,
//     needsOnboarding: user && !user.onboarding_completed,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // --- Custom Hook & Route Components ---

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // NOTE: In a real React application, you would use the `Maps` component
// // from `react-router-dom` instead of `window.location.href` for client-side routing.
// // The examples below use `window.location.href` for simplicity in this self-contained file.

// export const ProtectedRoute = ({ children, requireOnboarding = false }) => {
//   const { isAuthenticated, loading, needsOnboarding } = useAuth();
//   console.log('ProtectedRoute: isAuthenticated:', isAuthenticated, 'loading:', loading, 'needsOnboarding:', needsOnboarding);

//   if (loading) {
//     console.log('ProtectedRoute: Loading session...');
//     return <div>Loading session...</div>; // Or a spinner component
//   }

//   if (!isAuthenticated) {
//     console.log('ProtectedRoute: Not authenticated, redirecting to /login.');
//     window.location.href = '/login'; // This should ideally be a `Maps` component from react-router-dom
//     return null;
//   }

//   if (requireOnboarding && needsOnboarding) {
//     console.log('ProtectedRoute: User needs onboarding and route requires it. Staying on current route.');
//     // If the route requires onboarding and the user hasn't done it, stay.
//     // This is for the /onboarding page itself.
//     return children;
//   }
  
//   if (!requireOnboarding && needsOnboarding) {
//     console.log('ProtectedRoute: User needs onboarding but current route does not require it. Redirecting to /onboarding.');
//     // If any other protected route is accessed, redirect to onboarding.
//     window.location.href = '/onboarding'; // This should ideally be a `Maps` component from react-router-dom
//     return null;
//   }

//   console.log('ProtectedRoute: User is authenticated and meets onboarding requirements. Rendering children.');
//   return children;
// };

// export const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading, needsOnboarding } = useAuth();
//   console.log('PublicRoute: isAuthenticated:', isAuthenticated, 'loading:', loading, 'needsOnboarding:', needsOnboarding);


//   if (loading) {
//     console.log('PublicRoute: Loading session...');
//     return <div>Loading session...</div>; // Or a spinner component
//   }

//   if (isAuthenticated) {
//     const redirectPath = needsOnboarding ? '/onboarding' : '/dashboard';
//     console.log('PublicRoute: User is authenticated, redirecting away from public page to:', redirectPath);
//     // If the user is logged in, redirect them away from public pages (like login/register)
//     window.location.href = redirectPath; // This should ideally be a `Maps` component from react-router-dom
//     return null;
//   }

//   console.log('PublicRoute: User is not authenticated. Rendering children.');
//   return children;
// };
// src/app/AuthComponent.js
// src/app/AuthComponent.js
// src/app/AuthComponent.js
// src/app/components/AuthComponent.js
"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// --- Configuration ---
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketing-app-1.onrender.com/api';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
console.log('AuthComponent: API_URL set to', API_URL);

// --- Context Definition ---
const AuthContext = createContext();

// --- Local Storage Utilities ---
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const isClientSide = () => typeof window !== 'undefined';

const storage = {
  getToken: () => {
    if (!isClientSide()) return null;
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      console.log('AuthComponent storage: getToken called. Found token:', token ? 'YES' : 'NO');
      return token;
    } catch (e) {
      console.error('AuthComponent storage: Error accessing localStorage for token:', e);
      return null;
    }
  },
  setToken: (token) => {
    if (!isClientSide()) return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
      console.log('AuthComponent storage: setToken called. Token set.');
    } catch (e) {
      console.error('AuthComponent storage: Error setting token in localStorage:', e);
    }
  },
  getUser: () => {
    if (!isClientSide()) return null;
    try {
      const userStr = localStorage.getItem(USER_KEY);
      const user = userStr ? JSON.parse(userStr) : null;
      console.log('AuthComponent storage: getUser called. Found user:', user ? 'YES' : 'NO');
      return user;
    } catch (e) {
      console.error('AuthComponent storage: Error accessing/getting user from localStorage:', e);
      return null;
    }
  },
  setUser: (user) => {
    if (!isClientSide()) return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log('AuthComponent storage: setUser called. User set.');
    } catch (e) {
      console.error('AuthComponent storage: Error setting user in localStorage:', e);
    }
  },
  clear: () => {
    if (!isClientSide()) return;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      console.log('AuthComponent storage: clear called. Local storage cleared.');
    } catch (e) {
      console.error('AuthComponent storage: Error clearing localStorage:', e);
    }
  },
};

// --- Axios Interceptors ---
axios.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('AuthComponent Axios Interceptor: Request error:', error);
    return Promise.reject(error);
  }
);

// --- Auth Provider Component ---
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log('AuthComponent AuthProvider render: user state:', user, 'loading:', loading, 'error:', error);

  const fetchUserProfile = useCallback(async () => {
    console.log('AuthComponent fetchUserProfile: Attempting to fetch user profile...');
    try {
      const { data } = await axios.get('/auth/profile');
      storage.setUser(data);
      setUser(data);
      console.log('AuthComponent fetchUserProfile: User profile fetched successfully:', data);
      return data;
    } catch (err) {
      console.error('AuthComponent fetchUserProfile: Error fetching user profile:', err.response?.data?.detail || err.message, err);
      storage.clear();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthComponent useEffect: initAuth started.');
      setLoading(true);

      if (!isClientSide()) {
        console.warn('AuthComponent useEffect: Not running on client side, skipping initAuth logic.');
        setLoading(false);
        return;
      }

      try {
        const tokenFromUrl = searchParams.get('token');
        const errorFromUrl = searchParams.get('error');

        if (pathname === '/auth/google/callback') {
          console.log('AuthComponent useEffect: Detected Google OAuth callback path:', pathname);
          if (errorFromUrl) {
            setError(`Authentication failed: ${errorFromUrl}`);
            storage.clear();
            console.error('AuthComponent useEffect: Auth failed from URL error:', errorFromUrl);
            router.replace(pathname); // Clean URL by removing query params
            setLoading(false);
            return;
          } else if (tokenFromUrl) {
            console.log('AuthComponent useEffect: Processing token from URL (Google OAuth callback). Token found!');
            storage.setToken(tokenFromUrl);
            const fetchedUser = await fetchUserProfile();
            console.log('AuthComponent useEffect: User fetched after Google callback:', fetchedUser);
            if (fetchedUser) {
              const redirectPath = fetchedUser.onboarding_completed ? '/dashboard' : '/onboarding';
              console.log('AuthComponent useEffect: User authenticated, redirecting to:', redirectPath);
              router.replace(redirectPath);
              return;
            } else {
              console.error('AuthComponent useEffect: Failed to fetch user profile after Google callback, clearing session.');
              router.replace('/login');
              return;
            }
          } else {
            console.warn('AuthComponent useEffect: Landed on Google callback path without token or error.');
            storage.clear();
            router.replace('/login');
            return;
          }
        }

        console.log('AuthComponent useEffect: Not a Google callback path. Checking existing token in localStorage...');
        const existingToken = storage.getToken();
        if (existingToken) {
          console.log('AuthComponent useEffect: Existing token found, attempting to fetch user profile.');
          await fetchUserProfile();
        } else {
          console.log('AuthComponent useEffect: No existing token found. User is not authenticated via existing session.');
        }
      } catch (initError) {
        console.error('AuthComponent useEffect: Unexpected error during initAuth:', initError);
        setError('An unexpected error occurred during initialization.');
      } finally {
        setLoading(false);
        console.log('AuthComponent useEffect: initAuth finished. Loading set to false.');
      }
    };

    initAuth();
  }, [fetchUserProfile, pathname, searchParams]); // Depend on pathname and searchParams instead of router

  const login = async (email, password) => {
    console.log('AuthComponent login: Attempting login for email:', email);
    try {
      setError(null);
      const { data } = await axios.post('/auth/login', { email, password });
      storage.setToken(data.token);
      storage.setUser(data.user);
      setUser(data.user);
      console.log('AuthComponent login: Login successful. User:', data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(message);
      console.error('AuthComponent login: Login failed:', message, err);
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    console.log('AuthComponent register: Attempting registration for email:', email, 'name:', name);
    try {
      setError(null);
      const { data } = await axios.post('/auth/register', { name, email, password });
      storage.setToken(data.token);
      storage.setUser(data.user);
      setUser(data.user);
      console.log('AuthComponent register: Registration successful. User:', data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.detail || 'Registration failed. Please try again.';
      setError(message);
      console.error('AuthComponent register: Registration failed:', message, err);
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async () => {
    console.log('AuthComponent loginWithGoogle: Initiating Google login flow...');
    try {
      setError(null);
      const { data } = await axios.get('/auth/google/login');
      if (data.auth_url) {
        console.log('AuthComponent loginWithGoogle: Redirecting to Google auth URL:', data.auth_url);
        window.location.href = data.auth_url;
      } else {
        console.error('AuthComponent loginWithGoogle: No auth_url received from backend.');
        setError('Could not initiate Google login: No auth_url from server.');
      }
    } catch (err) {
      const message = err.response?.data?.detail || 'Could not initiate Google login.';
      setError(message);
      console.error('AuthComponent loginWithGoogle: Error initiating Google login:', message, err);
    }
  };

  const logout = () => {
    console.log('AuthComponent logout: Logging out user...');
    storage.clear();
    setUser(null);
    console.log('AuthComponent logout: Redirecting to /login.');
    router.push('/login');
  };

  const updateProfile = async (profileData) => {
    console.log('AuthComponent updateProfile: Attempting to update profile...');
    try {
      setError(null);
      await axios.put('/auth/profile', profileData);
      console.log('AuthComponent updateProfile: Profile updated, refetching user profile for consistency.');
      await fetchUserProfile();
      console.log('AuthComponent updateProfile: Profile update successful.');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to update profile.';
      setError(message);
      console.error('AuthComponent updateProfile: Failed to update profile:', message, err);
      return { success: false, error: message };
    }
  };

  const completeOnboarding = async (onboardingData) => {
    console.log('AuthComponent completeOnboarding: Attempting to complete onboarding...');
    try {
      setError(null);
      await axios.post('/auth/onboarding', onboardingData);
      const updatedUser = { ...user, onboarding_completed: true };
      setUser(updatedUser);
      storage.setUser(updatedUser);
      console.log('AuthComponent completeOnboarding: Onboarding completed successfully.');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to complete onboarding.';
      setError(message);
      console.error('AuthComponent completeOnboarding: Failed to complete onboarding:', message, err);
      return { success: false, error: message };
    }
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    completeOnboarding,
    isAuthenticated: !!user,
    needsOnboarding: user && !user.onboarding_completed,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// --- Custom Hook & Route Components ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute = ({ children, requireOnboarding = false }) => {
  const { isAuthenticated, loading, needsOnboarding } = useAuth();
  const router = useRouter();

  console.log('ProtectedRoute: isAuthenticated:', isAuthenticated, 'loading:', loading, 'needsOnboarding:', needsOnboarding);

  if (loading) {
    console.log('ProtectedRoute: Loading session...');
    return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to /login.');
    router.push('/login');
    return null;
  }

  if (requireOnboarding && needsOnboarding) {
    console.log('ProtectedRoute: User needs onboarding and route requires it. Staying on current route.');
    return children;
  }

  if (!requireOnboarding && needsOnboarding) {
    console.log('ProtectedRoute: User needs onboarding but current route does not require it. Redirecting to /onboarding.');
    router.push('/onboarding');
    return null;
  }

  console.log('ProtectedRoute: User is authenticated and meets onboarding requirements. Rendering children.');
  return children;
};

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, needsOnboarding } = useAuth();
  const router = useRouter();

  console.log('PublicRoute: isAuthenticated:', isAuthenticated, 'loading:', loading, 'needsOnboarding:', needsOnboarding);

  if (loading) {
    console.log('PublicRoute: Loading session...');
    return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  }

  if (isAuthenticated) {
    const redirectPath = needsOnboarding ? '/onboarding' : '/dashboard';
    console.log('PublicRoute: User is authenticated, redirecting away from public page to:', redirectPath);
    router.push(redirectPath);
    return null;
  }

  console.log('PublicRoute: User is not authenticated. Rendering children.');
  return children;
};