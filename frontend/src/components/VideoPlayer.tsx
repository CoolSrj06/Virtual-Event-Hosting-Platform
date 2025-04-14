
import { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Set loading to false after the player is ready
  const handleReady = () => {
    setIsLoading(false);
    // Auto play after loading
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playing={isPlaying}
        onReady={handleReady}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true,
            },
          },
        }}
        className="react-player"
      />
    </div>
  );
};

export default VideoPlayer;
