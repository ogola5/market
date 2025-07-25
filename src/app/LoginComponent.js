// src/components/LoginComponent.js
"use client";
import React, { useState, useEffect } from 'react'; // Added useEffect for potential future use or specific debug
import { useAuth } from './AuthComponent';

export const LoginComponent = () => {
  // Destructure auth context values
  const { login, register, loginWithGoogle, loading, error } = useAuth();
  
  // State for showing email form vs. Google button
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  // State for email/password form data, including password
  const [emailFormData, setEmailFormData] = useState({ 
    email: '', 
    name: '', 
    password: '', // Ensure password is part of the initial state
    isLogin: false 
  });

  // --- Debugging Logs for Component Render ---
  console.log('LoginComponent: Component rendered.');
  console.log('LoginComponent: Current form state:', emailFormData);
  console.log('LoginComponent: Auth loading state:', loading);
  console.log('LoginComponent: Auth error state:', error);

  // You can use useEffect here to react to changes in 'error' or 'loading'
  useEffect(() => {
    if (error) {
      console.error('LoginComponent useEffect: Auth context error changed:', error);
      // Potentially show a toast notification here
    }
    if (loading) {
      console.log('LoginComponent useEffect: Auth context loading state changed to true.');
    } else {
      console.log('LoginComponent useEffect: Auth context loading state changed to false.');
    }
  }, [error, loading]); // Log when error or loading state from auth context changes

  const handleGoogleLoginClick = async () => {
    console.log('LoginComponent: handleGoogleLoginClick initiated.');
    await loginWithGoogle();
    // No explicit redirect here as AuthComponent handles it after Google callback
    console.log('LoginComponent: loginWithGoogle call completed. AuthComponent handles redirect.');
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('LoginComponent: handleEmailAuth initiated.');
    console.log('LoginComponent: Form data submitted:', { 
      email: emailFormData.email, 
      name: emailFormData.name, 
      password: emailFormData.password ? '****' : 'EMPTY', // Mask password in logs
      isLogin: emailFormData.isLogin 
    });

    let result;
    if (emailFormData.isLogin) {
      console.log('LoginComponent: Attempting email login...');
      result = await login(emailFormData.email, emailFormData.password);
    } else {
      console.log('LoginComponent: Attempting email registration...');
      result = await register(emailFormData.name, emailFormData.email, emailFormData.password);
    }

    if (result.success) {
      console.log("LoginComponent: Email/Password authentication successful. AuthComponent should handle redirect.");
      // AuthComponent's useEffect will handle the redirect.
      // This part is crucial: Since AuthComponent sets the token in localStorage and then
      // its useEffect runs (or re-runs), it should detect the new token and trigger the redirect.
    } else {
      // Error handling is already done by AuthContext, and 'error' state is accessible here.
      console.error("LoginComponent: Authentication attempt failed. Error from useAuth:", error); 
      // The 'error' state from useAuth hook will be updated, and your UI will display it.
    }
  };

  const handleEmailFormDataChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData(prevData => ({ ...prevData, [name]: value }));
    console.log(`LoginComponent: Input changed - ${name}: ${value}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Marketing Agent</h1>
          <p className="text-gray-600">Generate powerful marketing campaigns with AI</p>
        </div>

        {/* Display error from AuthContext */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {!showEmailForm ? (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLoginClick}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" className="h-6 w-6" /> {/* Added Google icon */}
              <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>

            <button
              onClick={() => {
                setShowEmailForm(true);
                console.log('LoginComponent: Switched to email form view.');
              }}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Continue with Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setEmailFormData(prevData => ({...prevData, isLogin: false}));
                  console.log('LoginComponent: Switched to Register mode.');
                }}
                className={`flex-1 py-2 px-4 rounded-lg ${!emailFormData.isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Register
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailFormData(prevData => ({...prevData, isLogin: true}));
                  console.log('LoginComponent: Switched to Login mode.');
                }}
                className={`flex-1 py-2 px-4 rounded-lg ${emailFormData.isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Login
              </button>
            </div>

            <input
              type="email"
              name="email" // Added name attribute for easier handling in handleEmailFormDataChange
              placeholder="Email address"
              value={emailFormData.email}
              onChange={handleEmailFormDataChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            {!emailFormData.isLogin && (
              <input
                type="text"
                name="name" // Added name attribute
                placeholder="Full name"
                value={emailFormData.name}
                onChange={handleEmailFormDataChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            )}

            {/* THE FIX IS HERE: UNCOMMENTED AND BOUND PASSWORD INPUT */}
            <input
              type="password"
              name="password" // Added name attribute
              placeholder="Password"
              value={emailFormData.password} // Bind value to state
              onChange={handleEmailFormDataChange} // Update state on change
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : (emailFormData.isLogin ? 'Login' : 'Register')}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowEmailForm(false);
                setEmailFormData({ email: '', name: '', password: '', isLogin: false }); // Reset form data
                console.log('LoginComponent: Switched back to initial view and reset form.');
              }}
              className="w-full text-gray-500 text-sm mt-2 hover:text-gray-700"
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};