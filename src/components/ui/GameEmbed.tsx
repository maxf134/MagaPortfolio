import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { getAssetUrl } from '../../utils/asset';

export function GameEmbed({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 👇 Используем хук для отслеживания видимости
  const { ref: observerRef, isIntersecting } = useIntersectionObserver();

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
    <div className="media-wrapper" ref={observerRef as any}>
      <div className="media-container" ref={containerRef}>
        {isIntersecting ? (
          <iframe
            src={getAssetUrl(src)}
            title="Embedded Content"
            allow="autoplay; fullscreen; gamepad; xr-spatial-tracking"
            loading="lazy"
          />
        ) : (
          // Показываем заглушку, пока игра не появится на экране
          <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#111' }}>
            Игра загрузится при прокрутке...
          </div>
        )}
        
        {isIntersecting && (
          <button
            className="game-embed__fullscreen-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
          >
            {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
          </button>
        )}
      </div>
    </div>
  );
}