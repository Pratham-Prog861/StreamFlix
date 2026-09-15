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
    <div className="relative h-[56.25vw] min-h-[420px] max-h-[860px] w-full overflow-hidden">
      <img src={`${video.thumbnailUrl.replace('400/225', '1280/720')}`} alt={video.title} className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-black/70 to-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black/30"></div>
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
      <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"></div>

      <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-12 lg:p-16 w-full md:w-2/3 lg:w-1/2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200 mb-4">
          Featured Tonight
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg leading-tight">
          {video.title}
        </h1>
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-200 drop-shadow-md line-clamp-3">
          {video.description}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          {video.duration && (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white/90">
              {video.duration}
            </span>
          )}
          {video.genre && (
            <span className="rounded-full border border-fuchsia-300/40 bg-fuchsia-500/20 px-3 py-1 text-fuchsia-100">
              {video.genre}
            </span>
          )}
          <span className="rounded-full border border-emerald-300/40 bg-emerald-500/20 px-3 py-1 text-emerald-100">
            Stream in HD
          </span>
        </div>
        <div className="mt-6 flex space-x-4">
          <Link to={`/video/${video.id}`} className="flex items-center justify-center bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-transform duration-300 ease-in-out transform hover:scale-105">
            <PlayIcon />
            Play
          </Link>
           <button 
                onClick={handleWatchlistToggle}
                className="flex items-center justify-center bg-gray-500/70 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-600/70 transition-transform duration-300 ease-in-out transform hover:scale-105 backdrop-blur-sm"
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