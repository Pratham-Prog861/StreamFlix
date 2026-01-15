import { BackendVideo, Video } from "../types";

// Base URL without /api for static files
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const mapBackendVideoToFrontend = (
  backendVideo: BackendVideo
): Video => {
  const minutes = Math.floor(backendVideo.duration / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let durationStr =
    hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;

  // For TV shows, show number of seasons instead of duration on the card
  if (backendVideo.type === "tv" && backendVideo.numberOfSeasons) {
    durationStr = `${backendVideo.numberOfSeasons} Season${
      backendVideo.numberOfSeasons > 1 ? "s" : ""
    }`;
  }

  // Map qualities to full URLs
  const qualities = backendVideo.qualities
    ? Object.entries(backendVideo.qualities).reduce((acc, [key, path]) => {
        if (path) {
          acc[
            key as keyof typeof backendVideo.qualities
          ] = `${BASE_URL}${path}`;
        }
        return acc;
      }, {} as NonNullable<Video["qualities"]>)
    : undefined;

  // Use TMDB poster/backdrop if available, otherwise use local thumbnail
  const thumbnailUrl =
    backendVideo.posterPath ||
    (backendVideo.thumbnailPath
      ? `${BASE_URL}${backendVideo.thumbnailPath}`
      : "");
  const videoUrl = backendVideo.videoPath
    ? `${BASE_URL}${backendVideo.videoPath}`
    : "";

  return {
    id: backendVideo._id,
    title: backendVideo.title,
    description: backendVideo.description,
    thumbnailUrl,
    videoUrl,
    embedUrl: backendVideo.embedUrl,
    tmdbId: backendVideo.tmdbId,
    type: backendVideo.type,
    qualities,
    genre:
      backendVideo.genres && backendVideo.genres.length > 0
        ? backendVideo.genres[0]
        : "General",
    genres: backendVideo.genres,
    duration: durationStr,
    rating: "",
    views: backendVideo.views,
    uploader: backendVideo.uploader,
    processingStatus: backendVideo.processingStatus,
    createdAt: backendVideo.createdAt,
    numberOfSeasons: backendVideo.numberOfSeasons,
    seasonsData: backendVideo.seasonsData,
  };
};
