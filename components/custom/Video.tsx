import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  src: string;
  aspectRatio?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  thumbnail?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  aspectRatio = "16:9",
  width = "100%",
  height = "auto",
  autoplay = false,
  loop = false,
  muted = false,
  controls = true,
  thumbnail,
  onPlay,
  onPause,
  onEnded,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(!!thumbnail);

  const getVideoId = (url: string) => {
    let id = null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      id = match && match[2].length === 11 ? match[2] : null;
    } else if (url.includes("vimeo.com")) {
      const regExp = /vimeo.*\/(\d+)/i;
      const match = url.match(regExp);
      id = match ? match[1] : null;
    }
    return id;
  };

  const getEmbedUrl = (url: string) => {
    const id = getVideoId(url);
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${id}?autoplay=${
        autoplay ? 1 : 0
      }&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${
        controls ? 1 : 0
      }`;
    } else if (url.includes("vimeo.com")) {
      return `https://player.vimeo.com/video/${id}?autoplay=${
        autoplay ? 1 : 0
      }&loop=${loop ? 1 : 0}&muted=${muted ? 1 : 0}&controls=${
        controls ? 1 : 0
      }`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(src);

  const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
  const paddingTop = `${(aspectHeight / aspectWidth) * 100}%`;

  useEffect(() => {
    if (autoplay) {
      setIsPlaying(true);
    }
  }, [autoplay]);

  const handlePlay = () => {
    setIsPlaying(true);
    setShowThumbnail(false);
    onPlay && onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    onPause && onPause();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onEnded && onEnded();
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  return (
    <div
      style={{
        position: "relative",
        width: width,
        height: height === "auto" ? "auto" : height,
        paddingTop: height === "auto" ? paddingTop : undefined,
        overflow: "hidden",
      }}
    >
      <AnimatePresence>
        {showThumbnail && thumbnail && (
          <motion.img
            src={thumbnail}
            alt="Video thumbnail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={handlePlay}
          />
        )}
      </AnimatePresence>
      <motion.iframe
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="loader"></div>
        </div>
      )}
      {!controls && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
