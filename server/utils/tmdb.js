import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const getClient = () => {
  const apiKey = process.env.TMDB_API_KEY;
  console.log('TMDB API Key configured:', !!apiKey);
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not configured');
  }
  return axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
      api_key: apiKey,
    },
  });
};

export const searchTMDB = async (query, type = 'movie') => {
  try {
    const client = getClient();
    const response = await client.get(`/search/${type}`, {
      params: {
        query,
      },
    });
    return response.data;
  } catch (error) {
    console.error('TMDB Search Error:', error.message);
    throw error;
  }
};

export const getTMDBDetails = async (id, type = 'movie') => {
  try {
    const client = getClient();
    const response = await client.get(`/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error('TMDB Details Error:', error.message);
    throw error;
  }
};
