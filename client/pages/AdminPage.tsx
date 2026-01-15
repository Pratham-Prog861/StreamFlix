import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVideos } from '../context/VideoContext';
import api from '../services/api';

const AdminPage: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const { refreshVideos } = useVideos();
  const navigate = useNavigate();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [searchType, setSearchType] = useState<'movie' | 'tv'>('movie');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400">You need admin privileges to access this page.</p>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const data = await api.searchTMDB(searchQuery, searchType);
      setSearchResults(data.results || []);
    } catch (error: any) {
      console.error('Error searching TMDB:', error);
      setMessage({ type: 'error', text: 'Failed to search TMDB.' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (tmdbId: number, type: 'movie' | 'tv') => {
    setImportingId(tmdbId);
    try {
      await api.importVideo(tmdbId, type);
      await refreshVideos();
      setMessage({
        type: 'success',
        text: `${type === 'movie' ? 'Movie' : 'TV Show'} imported successfully!`,
      });
    } catch (error: any) {
      console.error('Error importing video:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to import video.' });
    } finally {
      setImportingId(null);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('streamflix_videos');
    localStorage.removeItem('streamflix_categories');
    window.location.reload();
  };

  return (
    <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-8 rounded-lg shadow-2xl shadow-black/30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide">
            Import Videos
          </h1>
          <button
            onClick={handleClearCache}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-1 rounded transition-colors"
          >
            Clear Cache
          </button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded text-center font-semibold ${
              message.type === 'error'
                ? 'bg-red-900/50 text-red-200'
                : 'bg-green-900/50 text-green-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <select
                value={searchType}
                onChange={e => setSearchType(e.target.value as 'movie' | 'tv')}
                className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              >
                <option value="movie">Movie</option>
                <option value="tv">TV Show</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search for ${
                  searchType === 'movie' ? 'movies' : 'TV shows'
                } on TMDB...`}
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-red-600 text-white px-6 py-3 rounded-md font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {searchResults.map(result => (
              <div
                key={result.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col"
              >
                <img
                  src={
                    result.poster_path
                      ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
                      : 'https://via.placeholder.com/500x750?text=No+Poster'
                  }
                  alt={result.title || result.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 truncate">{result.title || result.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {result.overview}
                  </p>
                  <button
                    onClick={() => handleImport(result.id, searchType)}
                    disabled={importingId === result.id}
                    className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {importingId === result.id ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {searchResults.length === 0 && !isSearching && searchQuery && (
            <p className="text-center text-gray-400 mt-8">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
