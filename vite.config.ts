import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MagaPortfolio/',
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        // 👇 Теперь manualChunks — это функция, которая принимает id модуля
        manualChunks(id) {
          // Если модуль находится в node_modules
          if (id.includes('node_modules')) {
            // Все, что связано с React, собираем в чанк 'react-vendor'
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Все, что связано с Three.js и его экосистемой, собираем в чанк 'three-vendor'
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            // Остальные библиотеки можно отправить в общий 'vendor'
            return 'vendor';
          }
        },
      },
    },
  },
})