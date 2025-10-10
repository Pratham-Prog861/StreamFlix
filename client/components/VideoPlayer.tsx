import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  qualities?: {
    '360p'?: string;
    '480p'?: string;
    '720p'?: string;
    '1080p'?: string;
    original?: string;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title, qualities }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Debug: Log qualities
  useEffect(() => {
    console.log('VideoPlayer qualities:', qualities);
    console.log('Available qualities:', qualities ? Object.keys(qualities).filter(q => qualities[q as keyof typeof qualities]) : []);
  }, [qualities]);

  // Get available qualities
  const availableQualities = qualities ? Object.keys(qualities).filter(q => qualities[q as keyof typeof qualities]) : [];
  const hasMultipleQualities = availableQualities.length > 0;

  // Determine best quality to use
  const getVideoSource = () => {
    if (!qualities) return src;
    
    if (currentQuality === 'auto') {
      // Auto select best available quality
      if (qualities['1080p']) return qualities['1080p'];
      if (qualities['720p']) return qualities['720p'];
      if (qualities['480p']) return qualities['480p'];
      if (qualities['360p']) return qualities['360p'];
      return qualities.original || src;
    }
    
    return qualities[currentQuality as keyof typeof qualities] || src;
  };

  const handleQualityChange = (quality: string) => {
    if (videoRef.current) {
      // Save current state
      const time = videoRef.current.currentTime;
      const playing = !videoRef.current.paused;
      
      setCurrentTime(time);
      setIsPlaying(playing);
      setCurrentQuality(quality);
      setShowQualityMenu(false);
    }
  };

  // Restore playback state after quality change
  useEffect(() => {
    if (videoRef.current && currentTime > 0) {
      videoRef.current.currentTime = currentTime;
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentQuality]);

  const qualityLabels: { [key: string]: string } = {
    '360p': '360p',
    '480p': '480p',
    '720p': '720p HD',
    '1080p': '1080p Full HD',
    original: 'Original',
    auto: 'Auto'
  };

  // Debug info
  console.log('Rendering VideoPlayer:', {
    hasQualities: !!qualities,
    qualitiesCount: availableQualities.length,
    hasMultipleQualities,
    currentQuality,
    videoSource: getVideoSource()
  });

  return (
    <div className="relative aspect-video w-full bg-black group">
      <video
        ref={videoRef}
        className="w-full h-full"
        src={getVideoSource()}
        title={title}
        controls
        autoPlay
        muted
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Debug indicator */}
      {qualities && (
        <div className="absolute top-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded">
          {availableQualities.length} qualities available
        </div>
      )}
      
      {hasMultipleQualities && (
        <div className="absolute bottom-16 right-4 z-10">
          <div className="relative">
            <button
              onClick={() => setShowQualityMenu(!showQualityMenu)}
              className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-all flex items-center space-x-2"
              title="Change quality"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">{qualityLabels[currentQuality]}</span>
            </button>
            
            {showQualityMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl min-w-[160px]">
                <div className="py-1">
                  <button
                    onClick={() => handleQualityChange('auto')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-red-600 transition-colors ${
                      currentQuality === 'auto' ? 'bg-red-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Auto</span>
                      {currentQuality === 'auto' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  {['1080p', '720p', '480p', '360p'].map(quality => {
                    if (qualities && qualities[quality as keyof typeof qualities]) {
                      return (
                        <button
                          key={quality}
                          onClick={() => handleQualityChange(quality)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-red-600 transition-colors ${
                            currentQuality === quality ? 'bg-red-600 text-white' : 'text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{qualityLabels[quality]}</span>
                            {currentQuality === quality && (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
