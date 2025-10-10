import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { useVideos } from '../context/VideoContext';

interface VideoCardProps {
  video: Video;
  className?: string;
}

const PlayIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/80" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
    </svg>
);

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);
const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const VideoCard: React.FC<VideoCardProps> = ({ video, className }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useVideos();
  const onWatchlist = isInWatchlist(video.id);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWatchlist) {
      removeFromWatchlist(video.id);
    } else {
      addToWatchlist(video.id);
    }
  };

  return (
    <Link to={`/video/${video.id}`} className={`block group rounded-lg overflow-hidden relative shadow-lg bg-gray-900 aspect-[16/9] ${className}`}>
      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <PlayIcon/>
      </div>
       <button 
        onClick={handleWatchlistClick}
        title={onWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        aria-label={onWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        className="absolute top-2 right-2 z-20 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/80 transition-all duration-300"
      >
        {onWatchlist ? <CheckIcon /> : <PlusIcon />}
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold text-sm sm:text-base truncate">{video.title}</h3>
        <div className="text-xs text-gray-300 mt-1 flex items-center space-x-2">
            {video.genre && <span>{video.genre}</span>}
            {(video.genre && video.duration) && <span>&bull;</span>}
            {video.duration && <span>{video.duration}</span>}
        </div>
      </div>
      {video.rating && <span className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full">{video.rating}</span>}
    </Link>
  );
};

export default VideoCard;