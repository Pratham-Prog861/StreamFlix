import React from "react";
import { Link } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import VideoGridSkeleton from "../components/VideoGridSkeleton";
import VideoRow from "../components/VideoRow";
import { useVideos } from "../context/VideoContext";
import { Video } from "../types";

const HeroBannerSkeleton: React.FC = () => (
  <div className="relative h-[56.25vw] min-h-[400px] max-h-[800px] w-full animate-pulse bg-gray-800">
    <div className="absolute bottom-0 left-0 p-4 sm:p-8 md:p-12 lg:p-16 w-full md:w-2/3 lg:w-1/2">
      <div className="h-10 md:h-14 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 mb-6"></div>
      <div className="flex space-x-4">
        <div className="h-12 w-28 bg-gray-700 rounded"></div>
        <div className="h-12 w-36 bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const { categories, allVideos, loading: contextLoading } = useVideos();
  const featuredVideo: Video | null = allVideos[0] || null;

  if (contextLoading) {
    return (
      <div>
        <HeroBannerSkeleton />
        <div className="mt-[-2rem] sm:mt-[-4rem] md:mt-[-5rem] relative z-10">
          <VideoGridSkeleton />
          <VideoGridSkeleton />
        </div>
      </div>
    );
  }

  if (allVideos.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-4xl font-bold mb-4">No Movies found</h1>
        <p className="text-gray-400 mb-8">
          Start by importing some movies from the Admin panel.
        </p>
        <Link
          to="/admin"
          className="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition-colors"
        >
          Go to Admin
        </Link>
      </div>
    );
  }

  return (
    <div>
      <HeroBanner video={featuredVideo} />
      <div className="mt-[-2rem] sm:mt-[-4rem] md:mt-[-5rem] relative z-10">
        {categories.slice(0, 2).map((category) => (
          <VideoRow
            key={category.id}
            title={category.name}
            videos={category.videos}
            genreId={category.id}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
