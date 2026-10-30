import { Canvas, useFrame, extend, type ThreeElement } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  shaderMaterial,
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/* ============================================================
   МАТЕРИАЛ ЧАСТИЦ — кастомный шейдер
   Пуш-эффект: частицы отталкиваются от курсора в 3D-пространстве.
   ============================================================ */
const ParticleMaterial = shaderMaterial(
  {
    uMouse: new THREE.Vector3(0, 0, 0),
    uTime: 0,
    uRadius: 1.6,
    uPulse: 0,
    uColor: new THREE.Color('#7c3aed'),
    uColor2: new THREE.Color('#22d3ee'),
  },
  /* vertex */ `
    uniform vec3 uMouse;
    uniform float uTime;
    uniform float uRadius;
    attribute float aSize;
    varying float vForce;
    varying float vHeight;

    void main() {
      vec3 pos = position;

      // лёгкий дрейф
      pos.x += sin(uTime * 0.3 + position.y * 0.6) * 0.08;
      pos.y += cos(uTime * 0.25 + position.x * 0.6) * 0.08;
      pos.z += sin(uTime * 0.2 + position.z * 0.8) * 0.05;

      // отталкивание от курсора
      float d = distance(pos, uMouse);
      float force = 1.0 - smoothstep(0.0, uRadius, d);
      vForce = force;

      vec3 dir = normalize(pos - uMouse + vec3(0.0001));
      pos += dir * force * 1.4;

      vHeight = pos.y;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mv;

      gl_PointSize = (aSize * (300.0 / -mv.z)) * (1.0 + force * 1.8);
    }
  `,
  /* fragment */ `
    uniform vec3 uColor;
    uniform vec3 uColor2;
    uniform float uPulse;
    varying float vForce;
    varying float vHeight;

    void main() {
      vec2 c = gl_PointCoord - 0.5;
      float d = length(c);
      if (d > 0.5) discard;

      float alpha = smoothstep(0.5, 0.0, d) * 0.7;

      // базовый градиент + подсветка от курсора
      vec3 col = mix(uColor, uColor2, vForce);
      col = mix(col, uColor2 * 1.6, uPulse * 0.6);

      alpha += vForce * 0.3;

      gl_FragColor = vec4(col, alpha);
    }
  `
);

extend({ ParticleMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    particleMaterial: ThreeElement<typeof ParticleMaterial>;
  }
}
/* ============================================================
   СИСТЕМА ЧАСТИЦ
   ============================================================ */
function Particles({ count = 3500, radius = 9 }) {
  const matRef = useRef<any>(null);
  const mouseNDC = useRef({ x: 0, y: 0 });

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.5; // сжимаем по Z
      sizes[i] = 0.4 + Math.random() * 1.4;
    }
    return { positions, sizes };
  }, [count, radius]);

  // Слушаем мышь на уровне окна — так эффект работает даже когда поверх Canvas есть контент
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uTime = state.clock.elapsedTime;

    // Переводим NDC-мышь в мировые координаты на плоскости z = 0
    const { camera } = state;
    const vec = new THREE.Vector3(
      mouseNDC.current.x,
      mouseNDC.current.y,
      0.5
    ).unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    const mouseWorld = camera.position.clone().add(dir.multiplyScalar(t));

    matRef.current.uMouse.lerp(mouseWorld, 0.15);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <particleMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================================
   ЖИВОЙ ПУЗЫРЬ
   Летает сам, светится изнутри, изредка "вспыхивает"
   ============================================================ */
function FloatingBlob() {
  const groupRef = useRef<THREE.Group>(null);
  const blobMatRef = useRef<any>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.position.x =
        Math.sin(t * 0.4) * 1.3 + Math.sin(t * 0.17) * 0.5;
      groupRef.current.position.y =
        Math.cos(t * 0.33) * 1.0 + Math.sin(t * 0.21) * 0.35;
      groupRef.current.position.z = Math.sin(t * 0.25) * 0.5;
      groupRef.current.rotation.y = t * 0.2;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    }

    

    // Редкий "импульс" — пик раз в ~12.5 секунд
    const pulse = Math.pow(Math.max(0, Math.sin(t * 0.5)), 24.0);

    if (blobMatRef.current) {
      blobMatRef.current.emissiveIntensity = 0.5 + pulse * 4.0;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 0.25 + pulse * 7.0;
      lightRef.current.position.x = Math.sin(t * 0.7) * 0.4;
      lightRef.current.position.y = Math.cos(t * 0.5) * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.6}>
        {/* Основной "пузырь" — светится изнутри */}
        <mesh>
          <sphereGeometry args={[0.85, 96, 96]} />
          <MeshDistortMaterial
            ref={blobMatRef}
            color="#1a0b2e"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
            distort={0.5}
            speed={1.8}
            roughness={0.05}
            metalness={0.85}
          />
        </mesh>

      </Float>

      <pointLight
        ref={lightRef}
        color="#a78bfa"
        distance={9}
        decay={2}
        intensity={0.25}
      />
    </group>
  );
}

/* ============================================================
   ГЛАВНЫЙ КОМПОНЕНТ СЦЕНЫ
   ============================================================ */
export function Scene() {
  return (
    <div className="scene-wrapper">
      <Canvas
        style={{ pointerEvents: 'none' }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Единственный источник "освещения" — ambient очень слабый,
            остальное — собственное свечение пузыря */}
        <ambientLight intensity={0.08} />

        <Particles />

        <FloatingBlob />

        <EffectComposer>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}