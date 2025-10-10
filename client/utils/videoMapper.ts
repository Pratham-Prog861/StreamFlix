import { Video, BackendVideo } from "../types";

// Base URL without /api for static files
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

export const mapBackendVideoToFrontend = (
  backendVideo: BackendVideo
): Video => {
  const minutes = Math.floor(backendVideo.duration / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const durationStr =
    hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;

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

  return {
    id: backendVideo._id,
    title: backendVideo.title,
    description: backendVideo.description,
    thumbnailUrl: `${BASE_URL}${backendVideo.thumbnailPath}`,
    videoUrl: `${BASE_URL}${backendVideo.videoPath}`,
    qualities,
    genre: "General", // Backend doesn't have genre yet, can be added later
    duration: durationStr,
    rating: "", // Backend doesn't have rating yet
    views: backendVideo.views,
    uploader: backendVideo.uploader,
    processingStatus: backendVideo.processingStatus,
    createdAt: backendVideo.createdAt,
  };
};
