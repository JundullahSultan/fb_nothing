import { useEffect, useRef } from 'react';

/**
 * Hook that enables mouse/touch-based video scrubbing.
 * Moving the cursor (or finger) horizontally scrubs the video timeline.
 * When `enabled` is false (hero not visible), stops seeking and detaches all listeners.
 */
export function useVideoScrub(enabled: boolean = true) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const prevXRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const performSeek = () => {
    if (!enabled) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      if (!isSeekingRef.current) {
        if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      }
    });
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
    if (!enabled) return;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      performSeek();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime;
    }
  };

  useEffect(() => {
    // When hero is not visible, stop animation completely and remove all listeners
    if (!enabled) {
      prevXRef.current = null;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      return;
    }

    const SENSITIVITY = 0.8;

    const scrub = (delta: number) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;

      targetTimeRef.current = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + timeOffset)
      );

      performSeek();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;
      scrub(delta);
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        prevXRef.current = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && prevXRef.current !== null) {
        const clientX = e.touches[0].clientX;
        const delta = clientX - prevXRef.current;
        prevXRef.current = clientX;
        scrub(delta);
      }
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled]);

  return { videoRef, handleSeeked, handleLoadedMetadata };
}
