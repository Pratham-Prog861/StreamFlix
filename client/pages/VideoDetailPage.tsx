import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVideos } from '../context/VideoContext';
import VideoPlayer from '../components/VideoPlayer';
import VideoRow from '../components/VideoRow';
import { Video } from '../types';

const SkeletonLoader = () => (
    <div className="pt-16 animate-pulse">
        <div className="aspect-video w-full bg-gray-800"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-10 bg-gray-800 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                 <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            </div>
        </div>
    </div>
);

const PlayIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { allVideos, isInWatchlist, addToWatchlist, removeFromWatchlist } = useVideos();
  const [video, setVideo] = useState<Video | null | undefined>(undefined);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVideo(undefined); // Reset on ID change to show loader

    // Simulate fetch
    const timer = setTimeout(() => {
        const foundVideo = allVideos.find(v => v.id === id) || null;
        console.log('Found video:', foundVideo);
        console.log('Video qualities:', foundVideo?.qualities);
        setVideo(foundVideo);

        if (foundVideo) {
          const related = allVideos.filter(v => v.genre === foundVideo.genre && v.id !== foundVideo.id).slice(0, 12);
          setRelatedVideos(related);
        } else {
            setRelatedVideos([]);
        }
    }, 300);

    return () => clearTimeout(timer);
  }, [id, allVideos]);

  if (video === undefined) {
    return <SkeletonLoader />;
  }

  if (!video) {
    return <div className="text-center py-40">Video not found.</div>;
  }

  const onWatchlist = isInWatchlist(video.id);

  const handleWatchlistToggle = () => {
      if (onWatchlist) {
          removeFromWatchlist(video.id);
      } else {
          addToWatchlist(video.id);
      }
  };

  return (
    <div className="pt-16">
      <VideoPlayer src={video.videoUrl} title={video.title} qualities={video.qualities} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-400 mb-4">
          {video.duration && <span>{video.duration}</span>}
          {video.genre && (
            <>
                <span>&bull;</span>
                <Link to={`/browse/${video.genre}`} className="bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors">
                    {video.genre}
                </Link>
            </>
          )}
          {video.rating && (
            <>
                <span>&bull;</span>
                <span className="border px-2 rounded">{video.rating}</span>
            </>
          )}
        </div>
        <p className="text-lg text-gray-300 max-w-3xl mb-6">{video.description}</p>
        
        <div className="flex space-x-4">
            <button className="flex items-center justify-center bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105">
                <PlayIcon />
                Play
            </button>
            <button 
                onClick={handleWatchlistToggle}
                className="flex items-center justify-center bg-gray-500/70 text-white font-bold py-2 px-6 rounded hover:bg-gray-600/70 transition-transform duration-300 ease-in-out transform hover:scale-105 backdrop-blur-sm"
            >
                {onWatchlist ? <CheckIcon /> : <PlusIcon />}
                {onWatchlist ? 'On My List' : 'Add to My List'}
            </button>
        </div>
      </div>

      {relatedVideos.length > 0 && (
        <div className="container mx-auto">
            {/* FIX: Add missing 'genreId' prop to satisfy VideoRowProps. Related videos share the same genre as the main video. */}
            <VideoRow title="Related Videos" videos={relatedVideos} genreId={video.genre} />
        </div>
      )}
    </div>
  );
};

export default VideoDetailPage;