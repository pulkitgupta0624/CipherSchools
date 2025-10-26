import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaCode, FaSun, FaMoon, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-900 ">
          <FaCode className="text-primary-600" />
          <span>CipherStudio</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 "
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button> */}
          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 ">
                Hi, {user.firstName}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-gray-600  p-2 rounded hover:bg-gray-100 "
                title="Logout"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 text-sm text-gray-600  p-2 rounded hover:bg-gray-100 "
            >
              <FaUser />
              Login / Register
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}