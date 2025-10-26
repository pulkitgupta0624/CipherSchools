// client/src/pages/Register.jsx
// Update all input field classNames

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaCode } from 'react-icons/fa';

export default function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    const { confirmPassword, ...userData } = formData;
    await register(userData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-600 to-primary-800 py-12">
      <div className="bg-white  p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <FaCode className="text-4xl text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900 ">CipherStudio</h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900  mb-6 text-center">
          Create Account
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white  text-gray-900 "
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white  text-gray-900 "
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white  text-gray-900 "
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              Mobile (Optional)
            </label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white  text-gray-900 "
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white  text-gray-900 "
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white  text-gray-900 "
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 ">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}