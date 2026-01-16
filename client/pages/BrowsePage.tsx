import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import VideoGridSkeleton from '../components/VideoGridSkeleton';

const BrowsePage: React.FC = () => {
  const { genre } = useParams<{ genre?: string }>();
  const { allVideos } = useVideos();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
        const filteredVideos: Video[] = genre 
        ? allVideos.filter(video => video.genre.toLowerCase() === genre.toLowerCase())
        : allVideos;
        setVideos(filteredVideos);
        setLoading(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, [genre, allVideos]);

  const title = genre ? `${genre} Movies` : 'All Movies';

  return (
    <div className="pt-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{title}</h1>
      {loading ? (
         <VideoGridSkeleton title={false} count={12} />
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
          {videos.map(video => (
             <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-400 mt-16">No videos found for this genre.</p>
      )}
    </div>
  );
};

export default BrowsePage;
