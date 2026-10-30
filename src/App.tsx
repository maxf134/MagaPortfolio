import { HashRouter, Route, Routes } from 'react-router-dom';
import { Scene } from './components/three/Scene';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { ScrollProvider } from './components/layout/ScrollProvider';
import { TransitionProvider } from './components/three/TransitionOverlay';
import { HomePage } from './pages/HomePage';
import { WorksPage } from './pages/WorksPage';
import { ProjectPage } from './pages/ProjectPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <ScrollProvider>
        <TransitionProvider>
          <CustomCursor />
          <Scene />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/works" element={<WorksPage />} />
            <Route path="/works/:id" element={<ProjectPage />} />
          </Routes>
        </TransitionProvider>
      </ScrollProvider>
    </HashRouter>
  );
}

export default App;