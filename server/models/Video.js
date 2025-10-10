import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoPath: {
    type: String,
    required: true
  },
  qualities: {
    '360p': { type: String },
    '480p': { type: String },
    '720p': { type: String },
    '1080p': { type: String },
    original: { type: String }
  },
  thumbnailPath: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploaderName: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  processingStatus: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  }
}, {
  timestamps: true
});

export default mongoose.model('Video', videoSchema);
