import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import VideoCard from './VideoCard';

interface VideoRowProps {
  title: string;
  videos: Video[];
  genreId: string;
}

const ArrowRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

const VideoRow: React.FC<VideoRowProps> = ({ title, videos, genreId }) => {
    const displayedVideos = videos.slice(0, 12);
    
    // For categories like 'Trending', which is not a real genre, link to the generic browse page.
    const linkTarget = genreId === 'trending' ? '/browse' : `/browse/${genreId}`;

    return (
        <section className="my-6 md:my-10">
            <div className="flex justify-between items-baseline mb-4 px-4 sm:px-6 lg:px-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
                {videos.length > 6 && (
                     <Link to={linkTarget} className="flex items-center text-sm font-semibold text-gray-300 hover:text-red-500 transition-colors duration-200 group whitespace-nowrap">
                        View All
                        <ArrowRightIcon className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 px-4 sm:px-6 lg:px-8">
                {displayedVideos.map((video, index) => (
                    <VideoCard key={`${video.id}-${index}`} video={video} />
                ))}
            </div>
        </section>
    );
};

export default VideoRow;