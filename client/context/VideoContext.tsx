import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Category, Video } from '../types';
import { CATEGORIES as initialCategories, ALL_VIDEOS as initialAllVideos } from '../data/mockData';
import api from '../services/api';
import { mapBackendVideoToFrontend } from '../utils/videoMapper';

interface VideoContextState {
  categories: Category[];
  allVideos: Video[];
  genres: string[];
  addVideo: (videoDetails: Omit<Video, 'id'>) => void;
  watchlist: string[];
  addToWatchlist: (videoId: string) => void;
  removeFromWatchlist: (videoId: string) => void;
  isInWatchlist: (videoId: string) => boolean;
  refreshVideos: () => Promise<void>;
  loading: boolean;
}

const VideoContext = createContext<VideoContextState | undefined>(undefined);

const LOCAL_STORAGE_KEY_VIDEOS = 'streamflix_videos';
const LOCAL_STORAGE_KEY_CATEGORIES = 'streamflix_categories';
const LOCAL_STORAGE_KEY_WATCHLIST = 'streamflix_watchlist';


export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch (error) {
      console.error("Could not load categories from localStorage", error);
      return initialCategories;
    }
  });

  const [allVideos, setAllVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_VIDEOS);
      return saved ? JSON.parse(saved) : initialAllVideos;
    } catch (error) {
      console.error("Could not load videos from localStorage", error);
      return initialAllVideos;
    }
  });

   const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_WATCHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load watchlist from localStorage", error);
      return [];
    }
  });

  // Fetch videos from backend on mount
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.getVideos(1, 100);
        const backendVideos = response.videos.map(mapBackendVideoToFrontend);
        
        if (backendVideos.length > 0) {
          setAllVideos(backendVideos);
          
          // Create a "All Videos" category with backend videos
          const allCategory: Category = {
            id: 'all',
            name: 'All Videos',
            videos: backendVideos
          };
          
          setCategories([allCategory]);
        }
      } catch (error) {
        console.error('Failed to fetch videos from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const refreshVideos = async () => {
    try {
      const response = await api.getVideos(1, 100);
      const backendVideos = response.videos.map(mapBackendVideoToFrontend);
      
      if (backendVideos.length > 0) {
        setAllVideos(backendVideos);
        
        const allCategory: Category = {
          id: 'all',
          name: 'All Videos',
          videos: backendVideos
        };
        
        setCategories([allCategory]);
      }
    } catch (error) {
      console.error('Failed to refresh videos:', error);
    }
  };

  useEffect(() => {
    try {
      // Filter out session-only videos (with blob URLs) before saving to prevent quota errors.
      const videosToPersist = allVideos.filter(video => !video.videoUrl.startsWith('blob:'));
      localStorage.setItem(LOCAL_STORAGE_KEY_VIDEOS, JSON.stringify(videosToPersist));
    } catch (error) {
      console.error("Could not save videos to localStorage", error);
    }
  }, [allVideos]);

  useEffect(() => {
    try {
       // Create a new array of categories with session-only videos filtered out.
      const categoriesToPersist = categories.map(category => ({
        ...category,
        videos: category.videos.filter(video => !video.videoUrl.startsWith('blob:'))
      }));

      // Remove any new categories that are now empty after filtering session-only videos.
      const finalCategoriesToPersist = categoriesToPersist.filter(category => {
          const isOriginalCategory = initialCategories.some(c => c.id === category.id);
          // Keep it if it's an original category OR if it's a new category that still has persistent videos.
          return isOriginalCategory || category.videos.length > 0;
      });

      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(finalCategoriesToPersist));
    } catch (error) {
      console.error("Could not save categories to localStorage", error);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
    } catch (error) {
      console.error("Could not save watchlist to localStorage", error);
    }
  }, [watchlist]);


  const genres = useMemo(() => {
    const allGenres = allVideos.map(video => video.genre).filter(Boolean);
    return [...new Set(allGenres)].sort();
  }, [allVideos]);

  const addVideo = (videoDetails: Omit<Video, 'id'>) => {
    const newVideo: Video = {
      ...videoDetails,
      id: `new-${Date.now()}`,
    };

    setAllVideos(prev => [newVideo, ...prev]);

    setCategories(prevCategories => {
      const newCategories = JSON.parse(JSON.stringify(prevCategories)) as Category[];
      const genre = videoDetails.genre || 'General';
      let category = newCategories.find(
        (cat) => cat.name.toLowerCase() === genre.toLowerCase()
      );

      if (category) {
        category.videos.unshift(newVideo);
      } else {
        const newCategory: Category = {
          id: genre.toLowerCase().replace(/\s+/g, '-'),
          name: genre,
          videos: [newVideo],
        };
        newCategories.splice(1, 0, newCategory);
      }
      return newCategories;
    });
  };

  const addToWatchlist = (videoId: string) => {
    setWatchlist(prev => {
        if (prev.includes(videoId)) return prev;
        return [...prev, videoId];
    });
  };

  const removeFromWatchlist = (videoId: string) => {
    setWatchlist(prev => prev.filter(id => id !== videoId));
  };

  const isInWatchlist = (videoId: string): boolean => {
    return watchlist.includes(videoId);
  };

  const value = { 
    categories, 
    allVideos, 
    addVideo, 
    genres, 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist,
    refreshVideos,
    loading
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = (): VideoContextState => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};