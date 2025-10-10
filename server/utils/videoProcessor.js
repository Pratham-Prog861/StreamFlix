import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateThumbnail = (videoPath, filename) => {
  return new Promise((resolve, reject) => {
    const thumbnailPath = path.join(__dirname, '../uploads/thumbnails', `${filename}.jpg`);

    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['10%'],
        filename: `${filename}.jpg`,
        folder: path.join(__dirname, '../uploads/thumbnails'),
        size: '320x240'
      })
      .on('end', () => resolve(thumbnailPath))
      .on('error', (err) => reject(err));
  });
};

export const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(Math.floor(metadata.format.duration));
    });
  });
};

export const getVideoResolution = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      if (videoStream) {
        resolve({ width: videoStream.width, height: videoStream.height });
      } else {
        reject(new Error('No video stream found'));
      }
    });
  });
};

export const transcodeVideo = (inputPath, outputPath, quality) => {
  return new Promise((resolve, reject) => {
    const qualitySettings = {
      '360p': { width: 640, height: 360, bitrate: '800k' },
      '480p': { width: 854, height: 480, bitrate: '1400k' },
      '720p': { width: 1280, height: 720, bitrate: '2800k' },
      '1080p': { width: 1920, height: 1080, bitrate: '5000k' }
    };

    const settings = qualitySettings[quality];
    if (!settings) {
      return reject(new Error(`Invalid quality: ${quality}`));
    }

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size(`${settings.width}x${settings.height}`)
      .videoBitrate(settings.bitrate)
      .audioBitrate('128k')
      .outputOptions([
        '-preset fast',
        '-movflags +faststart'
      ])
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
};

export const generateMultipleQualities = async (originalPath, filename) => {
  const qualities = {};
  const qualitiesFolder = path.join(__dirname, '../uploads/videos');

  try {
    // Get original video resolution
    const { height } = await getVideoResolution(originalPath);

    // Store original
    qualities.original = `/uploads/videos/${filename}`;

    // Determine which qualities to generate based on original resolution
    const qualityLevels = [];
    if (height >= 360) qualityLevels.push('360p');
    if (height >= 480) qualityLevels.push('480p');
    if (height >= 720) qualityLevels.push('720p');
    if (height >= 1080) qualityLevels.push('1080p');

    // Generate each quality
    for (const quality of qualityLevels) {
      const outputFilename = `${path.parse(filename).name}_${quality}${path.extname(filename)}`;
      const outputPath = path.join(qualitiesFolder, outputFilename);

      try {
        await transcodeVideo(originalPath, outputPath, quality);
        qualities[quality] = `/uploads/videos/${outputFilename}`;
        console.log(`Generated ${quality} for ${filename}`);
      } catch (error) {
        console.error(`Failed to generate ${quality}:`, error.message);
      }
    }

    return qualities;
  } catch (error) {
    console.error('Error generating qualities:', error);
    // Return at least the original
    return { original: `/uploads/videos/${filename}` };
  }
};

export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') return reject(err);
      resolve();
    });
  });
};
