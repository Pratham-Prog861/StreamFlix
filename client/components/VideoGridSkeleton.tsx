import React from 'react';
import VideoCardSkeleton from './VideoCardSkeleton';

interface VideoGridSkeletonProps {
  title?: boolean;
  count?: number;
}

const VideoGridSkeleton: React.FC<VideoGridSkeletonProps> = ({ title = true, count = 6 }) => {
  return (
    <section className="my-8 md:my-12">
      {title && (
        <div className="h-8 bg-gray-800 rounded w-1/4 mb-4 animate-pulse mx-4 sm:mx-6 lg:mx-8"></div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: count }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
};

export default VideoGridSkeleton;
