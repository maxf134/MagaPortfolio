import { Canvas, useFrame, extend, type ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

/* Материал "растворения" — noise-based dissolve */
const TransitionMaterial = shaderMaterial(
  {
    uProgress: 0,
    uColor: new THREE.Color('#090a0f'),
  },
  /* vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* fragment */ `
    uniform float uProgress;
    uniform vec3 uColor;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    void main() {
      float n = noise(vUv * 8.0) * 0.65 + noise(vUv * 20.0) * 0.35;
      float threshold = 1.0 - uProgress;
      float alpha = smoothstep(threshold - 0.12, threshold + 0.02, n);
      if (alpha < 0.01) discard;
      gl_FragColor = vec4(uColor, alpha);
    }
  `
);

extend({ TransitionMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    transitionMaterial: ThreeElement<typeof TransitionMaterial>;
  }
}

function TransitionQuad({ progressRef }: { progressRef: { current: number } }) {
  const matRef = useRef<any>(null);
  useFrame(() => {
    if (matRef.current) matRef.current.uProgress = progressRef.current;
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <transitionMaterial ref={matRef} transparent depthTest={false} />
    </mesh>
  );
}

/* ---------- Context ---------- */
interface TransitionCtx {
  navigateWithTransition: (to: string) => void;
  isAnimating: boolean;
}
const TransitionContext = createContext<TransitionCtx>({
  navigateWithTransition: () => {},
  isAnimating: false,
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const progressRef = useRef(0);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const navigateWithTransition = useCallback(
    (to: string) => {
      console.log('Клик сработал! Переход на:', to); 
      if (isAnimating) return;
      setIsAnimating(true);

      gsap.to(progressRef, {
        current: 1,
        duration: 0.65,
        ease: 'power2.inOut',
        onComplete: () => {
          navigate(to);
          setTimeout(() => {
            gsap.to(progressRef, {
              current: 0,
              duration: 0.85,
              ease: 'power2.inOut',
              onComplete: () => setIsAnimating(false),
            });
          }, 60);
        },
      });
    },
    [isAnimating, navigate]
  );

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isAnimating }}>
      {children}
      <div className="transition-overlay">
        <Canvas
          style={{ pointerEvents: 'none' }} 
          orthographic
          camera={{ position: [0, 0, 1] }}
          gl={{ alpha: true, antialias: false }}
          dpr={1.5}
        >
          <TransitionQuad progressRef={progressRef} />
        </Canvas>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  return useContext(TransitionContext);
}

export function TransitionLink({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { navigateWithTransition } = useTransition();
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        console.log("КЛИК ПО ССЫЛКЕ СРАБОТАЛ!");
        e.preventDefault();
        navigateWithTransition(to);
      }}
    >
      {children}
    </a>
  );
}