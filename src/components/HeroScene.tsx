import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HeroSceneProps {
  reduced: boolean;
  small: boolean;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') || canvas.getContext('webgl'),
    );
  } catch {
    return false;
  }
}

type Quality = 'low' | 'high';

function ZenGarden({ animate, quality }: { animate: boolean; quality: Quality }) {
  const group = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Group>(null);
  const seg = quality === 'high' ? 40 : 18;

  const leaves = useMemo(
    () =>
      Array.from({ length: quality === 'high' ? 7 : 4 }, (_, i) => ({
        position: [
          -3.2 + (i % 3) * 2.1,
          1.2 + Math.sin(i) * 1.1,
          -1.2 + (i % 2) * 1.4,
        ] as [number, number, number],
        rotation: [Math.PI / 3, i * 0.6, i * 0.4] as [number, number, number],
        scale: 0.5 + (i % 3) * 0.14,
        speed: 0.24 + i * 0.05,
      })),
    [quality],
  );

  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.09) * 0.14;
      group.current.position.y = Math.sin(t * 0.22) * 0.16;
    }

    if (ripple.current) {
      const pulse = 1 + (Math.sin(t * 0.35) + 1) * 0.07;
      ripple.current.scale.setScalar(pulse);
      ripple.current.children.forEach((child, i) => {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.16 + (Math.sin(t * 0.4 + i) + 1) * 0.06;
      });
    }
  });

  return (
    <group ref={group} position={[0.6, 0, 0]}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#fff6e6" />
      <directionalLight position={[-5, -2, 2]} intensity={0.5} color="#9caf88" />

      {/* zen stones */}
      <mesh position={[-1.9, -1.55, 0.2]} rotation={[0.2, 0.4, 0.1]} castShadow={false}>
        <sphereGeometry args={[1.02, seg, seg]} />
        <meshStandardMaterial color="#b9ae9d" roughness={0.92} />
      </mesh>
      <mesh position={[-1.55, -0.72, 0.35]} rotation={[0.1, 0.9, 0.2]}>
        <sphereGeometry args={[0.68, seg, seg]} />
        <meshStandardMaterial color="#c8b9a9" roughness={0.95} />
      </mesh>
      <mesh position={[-1.3, -0.12, 0.5]} rotation={[0.4, 0.2, 0.3]}>
        <sphereGeometry args={[0.4, seg, seg]} />
        <meshStandardMaterial color="#d6cabb" roughness={0.98} />
      </mesh>

      {/* water ripples */}
      <group ref={ripple} position={[-1.6, -2.1, 0.1]} rotation={[-Math.PI / 2.25, 0, 0]}>
        {[2.0, 2.7, 3.4].map((radius, i) => (
          <mesh key={radius} position={[0, 0, i * 0.02]}>
            <torusGeometry args={[radius, 0.012, 8, seg * 2]} />
            <meshBasicMaterial color="#8fa8b8" transparent opacity={0.22} />
          </mesh>
        ))}
      </group>

      {/* floating leaves */}
      {leaves.map((leaf, i) => (
        <FloatLeaf key={i} {...leaf} animate={animate} />
      ))}

      {/* meditation orb */}
      <mesh position={[2.5, 1.35, -0.6]}>
        <sphereGeometry args={[0.95, seg, seg]} />
        <meshStandardMaterial
          color="#9caf88"
          roughness={0.4}
          transparent
          opacity={0.34}
        />
      </mesh>
      <mesh position={[2.5, 1.35, -0.6]}>
        <sphereGeometry args={[1.22, seg, seg]} />
        <meshBasicMaterial color="#f7f2e8" transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  );
}

interface LeafProps {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
  animate: boolean;
}

function FloatLeaf({ position, rotation, scale, speed, animate }: LeafProps) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useMemo(() => position, [position]);

  useFrame((state) => {
    if (!animate || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = base[1] + Math.sin(t * speed) * 0.22;
    ref.current.position.x = base[0] + Math.cos(t * speed * 0.7) * 0.12;
    ref.current.rotation.z = rotation[2] + Math.sin(t * speed * 0.5) * 0.12;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={[scale, scale * 1.9, scale]}>
      <sphereGeometry args={[0.3, 14, 14]} />
      <meshStandardMaterial color="#8ea87c" roughness={0.7} transparent opacity={0.85} />
    </mesh>
  );
}

export default function HeroScene({ reduced, small }: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [webgl, setWebgl] = useState(false);

  const quality: Quality = small || reduced ? 'low' : 'high';
  const animate = !reduced && !paused;

  useEffect(() => {
    setWebgl(supportsWebGL());

    const start = () => setReady(true);
    const idle = (window as Window & {
      requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (typeof idle === 'function') {
      idle(start, { timeout: 1200 });
    } else {
      const timer = window.setTimeout(start, 350);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const node = wrapper.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setPaused(!entry.isIntersecting);
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="hero-scene"
      data-testid="hero-scene"
      data-motion={reduced ? 'static' : 'animated'}
      data-quality={quality}
      data-paused={paused ? 'true' : 'false'}
      data-lazy={ready ? 'mounted' : 'pending'}
      ref={wrapper}
      aria-hidden="true"
    >
      {ready && webgl ? (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 42 }}
          dpr={[1, quality === 'high' ? 1.5 : 1]}
          frameloop={animate ? 'always' : 'demand'}
          gl={{ antialias: quality === 'high', alpha: true, powerPreference: 'low-power' }}
          style={{ pointerEvents: 'none' }}
        >
          <ZenGarden animate={animate} quality={quality} />
        </Canvas>
      ) : (
        ready && <div className="hero-fallback" data-testid="hero-fallback" />
      )}
    </div>
  );
}
