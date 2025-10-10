import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { useVideos } from '../context/VideoContext';

interface HeroBannerProps {
  video: Video;
}

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


const HeroBanner: React.FC<HeroBannerProps> = ({ video }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useVideos();
  const onWatchlist = isInWatchlist(video.id);

  const handleWatchlistToggle = () => {
      if (onWatchlist) {
          removeFromWatchlist(video.id);
      } else {
          addToWatchlist(video.id);
      }
  };

  return (
    <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full">
      <img src={`${video.thumbnailUrl.replace('400/225', '1280/720')}`} alt={video.title} className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black/20"></div>

      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-12 lg:p-16 w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
          {video.title}
        </h1>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-200 drop-shadow-md line-clamp-3">
          {video.description}
        </p>
        <div className="mt-6 flex space-x-4">
          <Link to={`/video/${video.id}`} className="flex items-center justify-center bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105">
            <PlayIcon />
            Play
          </Link>
           <button 
                onClick={handleWatchlistToggle}
                className="flex items-center justify-center bg-gray-500/70 text-white font-bold py-2 px-6 rounded hover:bg-gray-600/70 transition-transform duration-300 ease-in-out transform hover:scale-105 backdrop-blur-sm"
            >
                {onWatchlist ? <CheckIcon /> : <PlusIcon />}
                {onWatchlist ? 'On My List' : 'Add to My List'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;