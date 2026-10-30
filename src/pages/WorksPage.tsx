import { getAssetUrl } from '../utils/asset';
import { useMemo, useState } from 'react';
import { projects } from '../data/projects';
import type { ProjectType } from '../data/projects';
import { TransitionLink } from '../components/three/TransitionOverlay';

const FILTERS: { key: ProjectType | 'all'; label: string }[] = [
  { key: 'all', label: 'ВСЕ' },
  { key: 'game', label: 'ИГРЫ' },
  { key: 'react-app', label: 'ПРИЛОЖЕНИЯ' },
  { key: 'motion-video', label: 'МОУШН' },
  { key: 'overlay', label: 'ОВЕРЛЕИ' },
];

export function WorksPage() {
  const [filter, setFilter] = useState<ProjectType | 'all'>('all');

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? projects
        : projects.filter((p) => p.type === filter),
    [filter]
  );

   return (
    <div className="page works">
      <header className="page__header">
        <div className="page__eyebrow">02 / РАБОТЫ</div>
        <h1 className="page__title">
          Избранные
          <br />
          <span>работы</span>
        </h1>
      </header>

      <div className="works__filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`works__filter ${filter === f.key ? 'is-active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="works__grid">
        {filtered.map((p) => (
          <TransitionLink
            key={p.id}
            to={`/works/${p.id}`}
            className="work-card"
          >
            <div className="work-card__thumb">
              <img src={getAssetUrl(p.thumbnail)} alt={p.title} loading="lazy" />
              <span className="work-card__type">{p.type}</span>
            </div>
            <div className="work-card__body">
              <h3 className="work-card__title">{p.title}</h3>
              <p className="work-card__desc">{p.description}</p>
              <div className="work-card__tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </TransitionLink>
        ))}
      </div>
    </div>
  );
}