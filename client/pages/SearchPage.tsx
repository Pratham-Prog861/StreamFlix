import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { allVideos } = useVideos();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';
  const [searchResults, setSearchResults] = useState<Video[]>([]);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const results = allVideos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.description.toLowerCase().includes(query) ||
      video.genre.toLowerCase().includes(query)
    );
    setSearchResults(results);
  }, [query, allVideos]);

  return (
    <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        {query ? `Search Results for "${query}"` : 'Please enter a search term'}
      </h1>
      {query && searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
           {searchResults.map(video => (
             <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        query && <p className="text-center text-xl text-gray-400 mt-16">No results found.</p>
      )}
    </div>
  );
};

export default SearchPage;