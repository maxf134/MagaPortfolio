import { useRef, useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/asset';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../data/projects';
import { GameEmbed } from '../components/ui/GameEmbed';
import { TransitionLink } from '../components/three/TransitionOverlay';

export function ProjectPage() {
  const { id } = useParams();
  const project = id ? getProjectById(id) : undefined;

  // --- Состояния и ссылки для видео ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false); 
  const feedbackTimeoutRef = useRef<number | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoControls, setShowVideoControls] = useState(true); 
  const controlsTimeoutRef = useRef<number | null>(null);

  // --- Функции управления видео ---
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }

      // Показываем иконку по центру и скрываем через 0.6 сек
      setShowFeedback(true);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = window.setTimeout(() => setShowFeedback(false), 600);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }

    // Принудительно показываем кнопку Exit/Fullscreen на пару секунд
    setShowVideoControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowVideoControls(false);
    }, 2000);
  }; // 👈 ТУТ БЫЛА ОШИБКА (не хватало этой скобки)

  // --- Отслеживание движения мыши (как на YouTube) ---
  const handleMouseMove = () => {
    setShowVideoControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      setShowVideoControls(false);
    }, 2000); 
  };

  const handleMouseLeave = () => {
    setShowVideoControls(false);
  };

  // --- Эффекты очистки и фуллскрина ---
  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  if (!project) {
    return (
      <div className="page">
        <h1>Проект не найден</h1>
        <TransitionLink to="/works" className="btn-primary">
          ← Назад к работам
        </TransitionLink>
      </div>
    );
  }

  return (
    <div className="page project">
      {/* Защита от автоперевода Chrome */}
      <div translate="no" className="notranslate">
        <TransitionLink to="/works" className="project__back">
          ← ВСЕ РАБОТЫ
        </TransitionLink>
      </div>

      <div className="project__header">
        <div className="project__eyebrow">
          {project.type.toUpperCase()} / {project.year ?? '—'}
        </div>
        <h1 className="project__title">{project.title}</h1>
        <p className="project__desc">{project.description}</p>
        <div className="project__tags">
          {project.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="project__content">
        {/* Игра (iframe) */}
        {project.embed?.type === 'iframe' && (
          <GameEmbed src={project.embed.url} />
        )}

        {/* Кастомный видеоплеер */}
        {project.embed?.type === 'video' && (
          <div className="media-wrapper">
            <div 
              className="media-container custom-video-container" 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <video
                ref={videoRef}
                onClick={togglePlay}
                src={getAssetUrl(project.embed.url)}
                poster={getAssetUrl('/thumbnails/video-placeholder.png')}
                preload="none"
                playsInline
                style={{ cursor: 'pointer' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Индикатор Play/Pause при клике */}
              <div className={`custom-play-btn ${showFeedback ? 'show-feedback' : ''}`}>
                {isPlaying ? '▶' : '❚❚'}
              </div>

              {/* Кнопка Fullscreen (появляется только через класс show) */}
              <button 
                className={`video-fullscreen-btn ${showVideoControls ? 'show' : ''}`} 
                onClick={toggleFullscreen}
              >
                {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
              </button>
            </div>
          </div>
        )}

        {/* Ссылка на GitHub */}
        {project.embed?.type === 'github-link' && (
          <a
            href={project.embed.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Открыть на GitHub ↗
          </a>
        )}

        {/* Внешняя ссылка */}
        {project.embed?.type === 'external' && (
          <a
            href={project.embed.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Открыть проект ↗
          </a>
        )}
      </div>
    </div>
  );
}