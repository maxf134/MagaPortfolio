export const getAssetUrl = (path: string) => {
  if (!path) return '';
  // Если это внешняя ссылка (начинается с http), возвращаем как есть
  if (path.startsWith('http')) return path;
  
  // Убираем ведущий слэш, если он есть
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // import.meta.env.BASE_URL вернет '/' локально и '/sait/' на GitHub Pages
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};