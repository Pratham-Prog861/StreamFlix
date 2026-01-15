import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VideoPlayer from "../components/VideoPlayer";
import VideoRow from "../components/VideoRow";
import { useVideos } from "../context/VideoContext";
import { Video } from "../types";

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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { allVideos, isInWatchlist, addToWatchlist, removeFromWatchlist } =
    useVideos();
  const [video, setVideo] = useState<Video | null | undefined>(undefined);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [activeProvider, setActiveProvider] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVideo(undefined); // Reset on ID change to show loader

    // Simulate fetch
    const timer = setTimeout(() => {
      const foundVideo = allVideos.find((v) => v.id === id) || null;
      setVideo(foundVideo);

      if (foundVideo) {
        const related = allVideos
          .filter((v) => v.genre === foundVideo.genre && v.id !== foundVideo.id)
          .slice(0, 12);
        setRelatedVideos(related);

        // Reset selectors for new TV show
        if (foundVideo.type === "tv") {
          setSelectedSeason(1);
          setSelectedEpisode(1);
        }
        setActiveProvider(0);
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

  const providers = [
    {
      name: "Vidking",
      url:
        video.type === "tv"
          ? `https://www.vidking.net/embed/tv/${video.tmdbId}/${selectedSeason}/${selectedEpisode}`
          : `https://www.vidking.net/embed/movie/${video.tmdbId}`,
    },
    {
      name: "Vidsrc.to",
      url:
        video.type === "tv"
          ? `https://vidsrc.to/embed/tv/${video.tmdbId}/${selectedSeason}/${selectedEpisode}`
          : `https://vidsrc.to/embed/movie/${video.tmdbId}`,
    },
    {
      name: "Vidsrc.me",
      url:
        video.type === "tv"
          ? `https://vidsrc.me/embed/tv?tmdb=${video.tmdbId}&sea=${selectedSeason}&epi=${selectedEpisode}`
          : `https://vidsrc.me/embed/movie?tmdb=${video.tmdbId}`,
    },
  ];

  const currentEmbedUrl = video.tmdbId
    ? providers[activeProvider].url
    : video.embedUrl;

  const currentSeasonData = video.seasonsData?.find(
    (s) => s.seasonNumber === selectedSeason
  );
  const episodeCount = currentSeasonData?.episodeCount || 0;

  return (
    <div className="pt-16">
      {currentEmbedUrl ? (
        <div className="w-full aspect-video bg-black">
          <iframe
            src={currentEmbedUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      ) : (
        <VideoPlayer
          src={video.videoUrl}
          title={video.title}
          qualities={video.qualities}
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {video.title}
            </h1>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-gray-400 mb-4">
              {video.duration && <span>{video.duration}</span>}
              {video.genres && video.genres.length > 0
                ? video.genres.map((g, i) => (
                    <React.Fragment key={g}>
                      {i > 0 && <span>&bull;</span>}
                      <Link
                        to={`/browse/${g}`}
                        className="bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors"
                      >
                        {g}
                      </Link>
                    </React.Fragment>
                  ))
                : video.genre && (
                    <>
                      <span>&bull;</span>
                      <Link
                        to={`/browse/${video.genre}`}
                        className="bg-gray-800 px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors"
                      >
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
          </div>

          <div className="flex flex-col gap-4">
            {video.tmdbId && (
              <div className="flex items-center gap-2 bg-gray-900/50 p-2 rounded-lg border border-gray-800">
                <span className="text-xs font-bold text-gray-500 uppercase ml-2">
                  Server:
                </span>
                {providers.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setActiveProvider(i)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      activeProvider === i
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {video.type === "tv" && (
              <div className="flex flex-wrap gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                {video.seasonsData && video.seasonsData.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Season
                      </label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => {
                          setSelectedSeason(Number(e.target.value));
                          setSelectedEpisode(1);
                        }}
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 min-w-[100px]"
                      >
                        {video.seasonsData
                          .filter((s) => s.seasonNumber > 0)
                          .map((s) => (
                            <option key={s.seasonNumber} value={s.seasonNumber}>
                              Season {s.seasonNumber}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">
                        Episode
                      </label>
                      <select
                        value={selectedEpisode}
                        onChange={(e) =>
                          setSelectedEpisode(Number(e.target.value))
                        }
                        className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 min-w-[100px]"
                      >
                        {Array.from(
                          { length: episodeCount },
                          (_, i) => i + 1
                        ).map((ep) => (
                          <option key={ep} value={ep}>
                            Episode {ep}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-yellow-500 font-medium">
                    Missing season data. Please re-import this show from the
                    Admin panel to fix.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-lg text-gray-300 max-w-3xl mb-6">
          {video.description}
        </p>

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
            {onWatchlist ? "On My List" : "Add to My List"}
          </button>
        </div>
      </div>

      {relatedVideos.length > 0 && (
        <div className="container mx-auto">
          {/* FIX: Add missing 'genreId' prop to satisfy VideoRowProps. Related videos share the same genre as the main video. */}
          <VideoRow
            title="Related Videos"
            videos={relatedVideos}
            genreId={video.genre}
          />
        </div>
      )}
    </div>
  );
};

export default VideoDetailPage;
