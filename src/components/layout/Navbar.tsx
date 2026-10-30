import { TransitionLink } from '../three/TransitionOverlay';

export function Navbar() {
  return (
    <nav className="navbar">
      <TransitionLink to="/" className="navbar__logo">
        ◆ ПОРТФОЛИО
      </TransitionLink>
      <div className="navbar__links">
        <TransitionLink to="/" className="navbar__link">
          ГЛАВНАЯ
        </TransitionLink>
        <TransitionLink to="/works" className="navbar__link">
          РАБОТЫ
        </TransitionLink>
      </div>
    </nav>
  );
}