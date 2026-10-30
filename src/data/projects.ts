export type ProjectType = 'game' | 'react-app' | 'motion-video' | 'overlay';

export interface Project {
  id: string;
  title: string;
  type: ProjectType;
  category: string;
  description: string;
  thumbnail: string;
  embed?: {
    type: 'iframe' | 'video' | 'github-link' | 'external';
    url: string;
  };
  tags: string[];
  year?: string;
}

/**
 * ЕДИНЫЙ РЕЕСТР ВСЕХ РАБОТ.
 * Добавляй сюда новые проекты — они автоматически появятся в портфолио.
 * Превью-картинки клади в public/thumbnails/ и указывай путь: '/thumbnails/name.jpg'
 */
export const projects: Project[] = [
  {
    id: 'rooms',
    title: 'Rooms',
    type: 'game',
    category: 'Игры',
    description: 'Процедурная генерация комнат в 2D',
    thumbnail: '/thumbnails/Rooms.png', 
    embed: {
      type: 'iframe', 
      url: '/games/Rooms/index.html' 
    },
    tags: ['GDevelop 5', 'HTML5'],
    year: '2026',
  },
  {
    id: 'cosmic_jam',
    title: 'Cosmic Jam',
    type: 'game',
    category: 'Игры',
    description: 'Космические войны',
    thumbnail: '/thumbnails/cosmic.png',
    embed: {
      type: 'iframe', 
      url: '/games/Cosmic_jam/index.html' 
    },
    tags: ['GDevelop 5', 'HTML5'],
    year: '2026',
  },
  {
    id: 'Proizvodstvennaya_liniya',
    title: 'Производственная линия',
    type: 'react-app',
    category: 'Приложения',
    description: 'Мини-приложение на React + TypeScript для визуализации производственной линии.',
    thumbnail: '/thumbnails/PL.png',
    embed: { type: 'external', url: 'https://maxf134.github.io/PL/' },
    tags: ['React', 'TypeScript', 'D3'],
    year: '2026',
  },
  {
    id: 'Car_game',
    title: 'Car Game',
    type: 'react-app',
    category: 'Приложения',
    description: 'Мини-приложение на React + TypeScript для визуализации парка.',
    thumbnail: '/thumbnails/car.png',
    embed: { type: 'external', url: 'https://maxf134.github.io/Car_Game/' },
    tags: ['React', 'TypeScript', 'D3'],
    year: '2026',
  },
  {
    id: 'Komix',
    title: 'Komix',
    type: 'react-app',
    category: 'Приложения',
    description: 'Мини-приложение на React + TypeScript для рисования комиксов.',
    thumbnail: '/thumbnails/komix.png',
    // ⚠️ Внимание: здесь указана та же ссылка, что и у Car_Game. Проверь URL!
    embed: { type: 'external', url: 'https://maxf134.github.io/Car_Game/' },
    tags: ['React', 'TypeScript', 'D3'],
    year: '2026',
  },
  {
    id: 'Logo_gold',
    title: 'Logo Gold',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео с партиклами. After Effects.',
    thumbnail: '/thumbnails/GOLD.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/RENDER LOGO_FHD.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'Granzh',
    title: 'Grunge',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео. After Effects.',
    thumbnail: '/thumbnails/granzh.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/Animation Vertical.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'Kontur',
    title: 'Kontur',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео. After Effects.',
    thumbnail: '/thumbnails/Kontur.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/Comp 01_2.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'Zerkalo',
    title: 'Zerkalo',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео. After Effects.',
    thumbnail: '/thumbnails/zerkalo.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/Final Render_3.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'glitch1',
    title: 'Glitch 1',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео. After Effects.',
    thumbnail: '/thumbnails/glitch1.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/Final_2.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'glitch2',
    title: 'Glitch 2',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео. After Effects.',
    thumbnail: '/thumbnails/glitch2.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/Glitch.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'zastavka',
    title: 'Заставка',
    type: 'motion-video',
    category: 'Моушн',
    description: 'Моушн-видео. After Effects.',
    thumbnail: '/thumbnails/zastavka.png', // 👈 Исправлен путь (добавлен /)
    embed: {
      type: 'video',
      url: '/video/Zastavka.mp4',
    },
    tags: ['After Effects'],
    year: '2024',
  },
  {
    id: 'stream-overlay',
    title: 'Stream HUD Overlay',
    type: 'overlay',
    category: 'Оверлеи',
    description: 'Оверлей для стримов на Twitch — сцена, алерты, чат-виджет. Минималистичный футуризм.',
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80',
    tags: ['OBS', 'CSS', 'HTML'],
    year: '2024',
  },
];

export const getProjectById = (id: string) =>
  projects.find((p) => p.id === id);