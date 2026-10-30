import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...mouse };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 1. Если навели на карточку проекта — всегда пишем "ПОСМОТРЕТЬ"
      if (target.closest('.work-card')) {
        setHovered(true);
        setCursorText('ПОСМОТРЕТЬ');
        return;
      }

      // 2. Если навели на логотип (Портфолио) — не трогаем его
      if (target.closest('.navbar__logo')) {
        setHovered(false);
        setCursorText('');
        return;
      }

      // 3. Если навели на обычную кнопку или ссылку — берем текст из кнопки
      const isButton = target.closest('a, button, .works__filter');
      if (isButton) {
        setHovered(true);
        const text = isButton.textContent?.trim() || '';
        setCursorText(text.toUpperCase());
      } else {
        setHovered(false);
        setCursorText('');
      }
    };

    let rafId = 0;
    const animate = () => {
      ring.x += (mouse.x - ring.x) * 0.15;
      ring.y += (mouse.y - ring.y) * 0.15;
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`cursor-dot ${hovered ? 'is-hidden' : ''}`} />
      <div ref={ringRef} className={`cursor-ring ${hovered ? 'is-lens' : ''}`}>
        {cursorText && <span className="cursor-lens-text">{cursorText}</span>}
      </div>
    </>
  );
}