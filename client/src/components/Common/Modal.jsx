import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b ">
          <h2 className="text-xl font-semibold text-gray-900 ">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100  rounded"
          >
            <FaTimes className="text-gray-500 " />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}