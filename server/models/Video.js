import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    // Manual upload fields
    videoPath: {
      type: String,
    },
    qualities: {
      '360p': { type: String },
      '480p': { type: String },
      '720p': { type: String },
      '1080p': { type: String },
      original: { type: String },
    },
    thumbnailPath: {
      type: String,
    },
    duration: {
      type: Number,
      default: 0,
    },
    // TMDB / Vidking fields
    tmdbId: {
      type: Number,
    },
    imdbId: {
      type: String,
    },
    type: {
      type: String,
      enum: ['movie', 'tv'],
      default: 'movie',
    },
    season: {
      type: Number,
    },
    episode: {
      type: Number,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
    // Common fields
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderName: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    processingStatus: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'completed', // Default to completed for imports
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Video', videoSchema);
