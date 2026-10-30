import { getAssetUrl } from '../utils/asset';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../data/projects';
import { GameEmbed } from '../components/ui/GameEmbed';
import { TransitionLink } from '../components/three/TransitionOverlay';

export function ProjectPage() {
  const { id } = useParams();
  const project = id ? getProjectById(id) : undefined;

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
      {/* Кнопка теперь с классом для фиксации */}
      <TransitionLink to="/works" className="project__back notranslate" translate="no">
        ← ВСЕ РАБОТЫ
      </TransitionLink>

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

        {/* Видео (теперь в такой же рамке, как игра) */}
        {project.embed?.type === 'video' && (
          <div className="media-wrapper">
            <div className="media-container">
              <video
                src={getAssetUrl(project.embed.url)}
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            </div>
          </div>
        )}

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