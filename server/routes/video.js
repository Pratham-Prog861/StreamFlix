import express from 'express';
import { body, validationResult } from 'express-validator';
import Video from '../models/Video.js';
import { protect, admin } from '../middleware/auth.js';
import { uploadVideo } from '../middleware/upload.js';
import { generateThumbnail, getVideoDuration, deleteFile, generateMultipleQualities } from '../utils/videoProcessor.js';
import path from 'path';

const router = express.Router();

// Get all videos with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Video.countDocuments();
    const videos = await Video.find()
      .populate('uploader', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      videos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('uploader', 'name avatar');
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload video (Admin only)
router.post('/', protect, admin, uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const { title, description } = req.body;
    if (!title) {
      await deleteFile(req.file.path);
      return res.status(400).json({ message: 'Title is required' });
    }

    const videoPath = req.file.path;
    const filename = path.parse(req.file.filename).name;

    // Generate thumbnail and get duration immediately
    const [thumbnailPath, duration] = await Promise.all([
      generateThumbnail(videoPath, filename),
      getVideoDuration(videoPath)
    ]);

    // Create video with processing status
    const video = await Video.create({
      title,
      description: description || '',
      videoPath: `/uploads/videos/${req.file.filename}`,
      qualities: { original: `/uploads/videos/${req.file.filename}` },
      thumbnailPath: `/uploads/thumbnails/${filename}.jpg`,
      duration,
      uploader: req.user._id,
      uploaderName: req.user.name,
      processingStatus: 'processing'
    });

    const populatedVideo = await Video.findById(video._id).populate('uploader', 'name avatar');

    // Send response immediately
    res.status(201).json(populatedVideo);

    // Generate qualities in background
    generateMultipleQualities(videoPath, req.file.filename)
      .then(async (qualities) => {
        await Video.findByIdAndUpdate(video._id, {
          qualities,
          processingStatus: 'completed'
        });
        console.log(`Video ${video._id} processing completed`);
      })
      .catch(async (error) => {
        console.error(`Failed to process video ${video._id}:`, error);
        await Video.findByIdAndUpdate(video._id, {
          processingStatus: 'failed'
        });
      });

  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
});

// Update video (Admin only)
router.put('/:id', protect, admin, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploader', 'name avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete video (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Delete all quality versions
    const deletePromises = [];

    if (video.qualities) {
      Object.values(video.qualities).forEach(qualityPath => {
        if (qualityPath) {
          const filePath = path.join(process.cwd(), qualityPath);
          deletePromises.push(deleteFile(filePath));
        }
      });
    }

    // Delete original if it exists separately
    if (video.videoPath) {
      const videoFilePath = path.join(process.cwd(), video.videoPath);
      deletePromises.push(deleteFile(videoFilePath));
    }

    // Delete thumbnail
    const thumbnailFilePath = path.join(process.cwd(), video.thumbnailPath);
    deletePromises.push(deleteFile(thumbnailFilePath));

    // Delete from database
    deletePromises.push(Video.findByIdAndDelete(req.params.id));

    await Promise.all(deletePromises);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
