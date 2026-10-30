import { useRef, useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/asset';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../data/projects';
import { GameEmbed } from '../components/ui/GameEmbed';
import { TransitionLink } from '../components/three/TransitionOverlay';

export function ProjectPage() {
  const { id } = useParams();
  const project = id ? getProjectById(id) : undefined;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 👇 Состояния для YouTube-подобного плеера
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // 👇 Функция переключения (Play/Pause)
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }

      // Показываем иконку и запускаем таймер на её исчезновение
      setShowFeedback(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      timeoutRef.current = window.setTimeout(() => {
        setShowFeedback(false);
      }, 600); // Иконка исчезнет через 0.6 секунды
    }
  };

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
        {project.embed?.type === 'iframe' && (
          <GameEmbed src={project.embed.url} />
        )}

        {project.embed?.type === 'video' && (
          <div className="media-wrapper">
            <div className="media-container custom-video-container">
              <video
                ref={videoRef}
                onClick={togglePlay}
                src={getAssetUrl(project.embed.url)}
                poster={getAssetUrl('/thumbnails/video-placeholder.png')}
                preload="none"
                playsInline
                style={{ cursor: 'pointer' }}
                // 👇 Синхронизируем состояние, если видео останавливается извне
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* 👇 Кнопка появляется только при клике (класс show-feedback) */}
              <div className={`custom-play-btn ${showFeedback ? 'show-feedback' : ''}`}>
                {isPlaying ? '▶' : '❚❚'}
              </div>
            </div>
          </div>
        )}

        {project.embed?.type === 'github-link' && (
          <a href={project.embed.url} target="_blank" rel="noreferrer" className="btn-primary">
            Открыть на GitHub ↗
          </a>
        )}

        {project.embed?.type === 'external' && (
          <a href={project.embed.url} target="_blank" rel="noreferrer" className="btn-primary">
            Открыть проект ↗
          </a>
        )}
      </div>
    </div>
  );
}