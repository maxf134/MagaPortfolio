import { useEffect, useRef, useState } from 'react';

export function GameEmbed({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div className="media-wrapper">
      <div className="media-container" ref={containerRef}>
        <iframe
          src={src}
          title="Embedded Content"
          allow="autoplay; fullscreen; gamepad; xr-spatial-tracking"
          loading="lazy"
        />
        <button
          className="game-embed__fullscreen-btn"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
        >
          {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
        </button>
      </div>
    </div>
  );
}