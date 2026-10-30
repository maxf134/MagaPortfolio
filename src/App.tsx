import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Scene } from './components/three/Scene';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { ScrollProvider } from './components/layout/ScrollProvider';
import { TransitionProvider } from './components/three/TransitionOverlay';

// 👇 Главную оставляем в основном бандле
import { HomePage } from './pages/HomePage';

// 👇 Остальные страницы загружаем лениво (только при переходе на них)
const WorksPage = lazy(() => import('./pages/WorksPage').then(m => ({ default: m.WorksPage })));
const ProjectPage = lazy(() => import('./pages/ProjectPage').then(m => ({ default: m.ProjectPage })));

import './App.css';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollProvider>
        <TransitionProvider>
          <CustomCursor />
          <Scene />
          <Navbar />
          
          <Suspense fallback={
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'monospace' }}>
              ЗАГРУЗКА...
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/works" element={<WorksPage />} />
              <Route path="/works/:id" element={<ProjectPage />} />
            </Routes>
          </Suspense>
          
        </TransitionProvider>
      </ScrollProvider>
    </BrowserRouter>
  );
}

export default App;