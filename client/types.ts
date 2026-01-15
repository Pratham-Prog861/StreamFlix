export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  qualities?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
    original?: string;
  };
  genre: string;
  duration: string;
  rating: string;
  views?: number;
  uploader?: {
    _id: string;
    name: string;
    avatar: string;
  };
  processingStatus?: string;
  createdAt?: string;
  embedUrl?: string;
  tmdbId?: number;
  type?: 'movie' | 'tv';
  season?: number;
  episode?: number;
}

export interface Category {
  id: string;
  name: string;
  videos: Video[];
}

export interface BackendVideo {
  _id: string;
  title: string;
  description: string;
  videoPath: string;
  qualities?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
    original?: string;
  };
  thumbnailPath: string;
  duration: number;
  uploader: { _id: string; name: string; avatar: string };
  uploaderName: string;
  views: number;
  processingStatus?: string;
  createdAt: string;
  tmdbId?: number;
  type?: 'movie' | 'tv';
  posterPath?: string;
  backdropPath?: string;
  embedUrl?: string;
}
