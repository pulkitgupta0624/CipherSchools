import React from 'react';
import { FaFile, FaJs, FaCss3, FaHtml5, FaReact, FaMarkdown, FaFileCode } from 'react-icons/fa';
import { SiTypescript, SiJson } from 'react-icons/si';

export const getFileIcon = (extension) => {
  const iconMap = {
    'js': <FaJs className="text-yellow-400" />,
    'jsx': <FaReact className="text-cyan-400" />,
    'ts': <SiTypescript className="text-blue-400" />,
    'tsx': <SiTypescript className="text-blue-400" />,
    'css': <FaCss3 className="text-blue-500" />,
    'scss': <FaCss3 className="text-pink-400" />,
    'html': <FaHtml5 className="text-orange-500" />,
    'json': <SiJson className="text-yellow-600" />,
    'md': <FaMarkdown className="text-gray-400" />,
    'svg': <FaFileCode className="text-orange-400" />,
  };

  return iconMap[extension] || <FaFile className="text-gray-400" />;
};