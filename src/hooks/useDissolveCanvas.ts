import { useEffect, useRef } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "../shaders";

interface UseDissolveCanvasOptions {
  heroRef: React.RefObject<HTMLElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const CONFIG = {
  color: "#929292",
  spread: 0.5,
  speed: 0.1,
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0.89, g: 0.89, b: 0.89 };
}

export function useDissolveCanvas({ heroRef, canvasRef }: UseDissolveCanvasOptions) {
  const scrollProgressRef = useRef(0);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number>(0);
  // Track whether the WebGL context is ready
  const isReadyRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    rendererRef.current = renderer;

    const rgb = hexToRgb(CONFIG.color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight) },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: CONFIG.spread },
      },
      transparent: true,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function resize() {
      const width = hero!.offsetWidth;
      const height = hero!.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(width, height);
    }

    resize();
    window.addEventListener("resize", resize);

    // Mark as ready after first render
    function animate() {
      material.uniforms.uProgress.value = scrollProgressRef.current;
      renderer.render(scene, camera);
      if (!isReadyRef.current) {
        isReadyRef.current = true;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      isReadyRef.current = false;
    };
  }, [heroRef, canvasRef]);

  const setScrollProgress = (value: number) => {
    scrollProgressRef.current = value;
  };

  // Expose the raw progress ref so Hero can read it in its own rAF
  return { setScrollProgress, scrollProgressRef, isReadyRef };
}