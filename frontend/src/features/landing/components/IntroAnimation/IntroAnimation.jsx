import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import introVideo from "@/assets/animations/ratinocare-intro.mp4";

const IntroAnimation = ({ onComplete, onSkip }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleEnded = () => {
      onComplete?.();
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        aria-label="RatinoCare introduction animation"
      />

      <button
        type="button"
        onClick={onSkip}
        className="absolute bottom-6 right-6 rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-slate-700 shadow-lg backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip
      </button>
    </motion.div>
  );
};

export default IntroAnimation;