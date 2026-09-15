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
  const { categories, allVideos, genres, loading: contextLoading } = useVideos();
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
    <div className="relative overflow-hidden">
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
      <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
      <HeroBanner video={featuredVideo} />
      <div className="mt-[-2rem] sm:mt-[-4rem] md:mt-[-5rem] relative z-10 space-y-8">
        {categories.slice(0, 2).map((category) => (
          <VideoRow
            key={category.id}
            title={category.name}
            videos={category.videos}
            genreId={category.id}
          />
        ))}

        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200 mb-2">Curated</p>
              <h3 className="text-xl font-bold text-white">Fresh Discovery Feed</h3>
              <p className="text-sm text-gray-300 mt-2">Get a sharper mix than generic streaming homepages.</p>
            </div>
            <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200 mb-2">Faster</p>
              <h3 className="text-xl font-bold text-white">Switch Servers Instantly</h3>
              <p className="text-sm text-gray-300 mt-2">Jump providers in one tap for the best stream quality.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-200 mb-2">Personal</p>
              <h3 className="text-xl font-bold text-white">Built Around Your List</h3>
              <p className="text-sm text-gray-300 mt-2">Keep titles organized and pick up watching quickly.</p>
            </div>
          </div>
        </section>

        {genres.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Explore by vibe</h2>
              <div className="flex flex-wrap gap-2">
                {genres.slice(0, 8).map((genre) => (
                  <Link
                    key={genre}
                    to={`/browse/${encodeURIComponent(genre)}`}
                    className="rounded-full border border-gray-700 bg-black/40 px-4 py-2 text-sm text-gray-200 hover:border-red-500 hover:text-white transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
