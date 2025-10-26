import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaCode } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900  mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600  mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <FaHome />
            Go Home
          </Link>
          <Link
            to="/ide"
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            <FaCode />
            Open IDE
          </Link>
        </div>
      </div>
    </div>
  );
}