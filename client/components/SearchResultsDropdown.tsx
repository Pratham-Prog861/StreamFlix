import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';

interface SearchResultsDropdownProps {
  results: Video[];
  query: string;
  onClose: () => void;
}

const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ results, query, onClose }) => {
  return (
    <div className="absolute top-full mt-2 w-full sm:w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-md shadow-lg z-50">
      <ul className="max-h-96 overflow-y-auto scrollbar-hide">
        {results.map(video => (
          <li key={video.id}>
            <Link 
              to={`/video/${video.id}`} 
              onClick={onClose}
              className="flex items-center p-3 hover:bg-gray-800 transition-colors duration-200"
            >
              <img src={video.thumbnailUrl} alt={video.title} className="w-24 h-14 object-cover rounded-md mr-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
                <p className="text-gray-400 text-xs mt-1">{video.genre}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {results.length > 0 && (
        <Link 
            to={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="block text-center p-3 text-sm font-semibold text-red-500 hover:bg-gray-800 rounded-b-md transition-colors"
        >
            View all results
        </Link>
      )}
    </div>
  );
};

export default SearchResultsDropdown;