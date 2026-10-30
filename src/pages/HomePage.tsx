import { TransitionLink } from '../components/three/TransitionOverlay';

export function HomePage() {
  return (
    <div className="hero">
      <div className="hero__eyebrow">ПОРТФОЛИО / 2026 — ЦИФРОВАЯ ВИТРИНА</div>
      <h1 className="hero__title">
        Цифровые
        <br />
        <span>миры</span>
      </h1>
      <p className="hero__subtitle">ИГРЫ · ПРИЛОЖЕНИЯ · МОУШН · ОВЕРЛЕИ</p>

      <div className="hero__cta">
        <TransitionLink to="/works" className="btn-primary">
          Смотреть работы →
        </TransitionLink>
      </div>
    </div>
  );
}