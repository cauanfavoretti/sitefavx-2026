"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ShaderMaterial, Vector2 } from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uShapeTime;
  uniform float uAspect;
  uniform vec2 uPointer;
  uniform vec2 uClick;
  uniform float uPulse;
  uniform float uWarm;

  float field(vec2 p, float shape) {
    float t = uTime * 0.22;
    if (shape < 0.5) return p.y + p.x * 0.75 + sin(p.x * 3.2 + t) * 0.045;
    if (shape < 1.5) return p.y + sin(p.x * 3.0 + t) * 0.3;
    if (shape < 2.5) {
      float angle = atan(p.y, p.x);
      return sin(length(p) * 6.0 - angle * 2.0 - t) * 0.46;
    }
    if (shape < 3.5) return length(p * vec2(0.8, 1.3)) - 0.55;
    return p.y + sin(p.x * 1.6 + t) * (0.2 + p.x * 0.3);
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 1.6;
    p += uPointer * 0.045;
    vec2 click = (uClick - 0.5) * vec2(uAspect, 1.0) * 1.6;
    vec2 away = p - click;
    float distanceToClick = length(away);
    float wave = sin(distanceToClick * 17.0 - (3.0 - uPulse) * 5.0)
      * exp(-distanceToClick * 2.0) * uPulse * 0.025;
    p += away / max(distanceToClick, 0.001) * wave;

    float shape = mod(floor(uShapeTime / 12.0), 5.0);
    float next = mod(shape + 1.0, 5.0);
    float morph = smoothstep(7.0, 12.0, mod(uShapeTime, 12.0));
    float f = mix(field(p, shape), field(p, next), morph);
    vec3 color = vec3(0.0);
    vec3 blue = vec3(0.18, 0.42, 0.95);
    vec3 paleBlue = vec3(0.42, 0.70, 0.98);
    vec3 orange = vec3(1.0, 0.27, 0.06);
    for (int i = 0; i < 7; i++) {
      float band = float(i);
      float d = abs(f - (band - 3.0) * 0.19);
      float halo = exp(-d * d * 55.0) * 0.16;
      float core = exp(-d * d * 700.0) * 0.24;
      float warm = smoothstep(0.88, 1.0, sin(uTime * 0.12 + band * 0.6)) * 0.3;
      warm = max(warm, uWarm * uPulse * 0.14);
      vec3 tint = mix(mix(blue, paleBlue, vUv.x), orange, warm);
      color += tint * (halo + core);
    }
    color *= mix(0.42, 0.9, smoothstep(0.05, 0.95, vUv.x));
    color += blue * exp(-length(p - vec2(0.5, 0.4)) * 1.7) * 0.055;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function AuroraPlane({ active, reduced }: { active: boolean; reduced: boolean }) {
  const material = useRef<ShaderMaterial>(null);
  const { gl, size, invalidate } = useThree();
  const lastFrame = useRef(0);
  const pointer = useRef(new Vector2());
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uShapeTime: { value: 0 }, uAspect: { value: 1 },
    uPointer: { value: new Vector2() }, uClick: { value: new Vector2(0.5, 0.5) },
    uPulse: { value: 0 }, uWarm: { value: 0 },
  }), []);

  useEffect(() => {
    // Renderização sob demanda: sem trabalho contínuo quando a hero está oculta.
    lastFrame.current = 0;
    invalidate();
    if (!active || reduced) return;
    const timer = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(timer);
  }, [active, reduced, invalidate]);

  useEffect(() => {
    const hero = gl.domElement.closest<HTMLElement>("#topo");
    if (!hero) return;
    let warm = true;
    const move = (event: PointerEvent) => {
      if (reduced) return;
      const rect = hero.getBoundingClientRect();
      pointer.current.set((event.clientX - rect.left) / rect.width - 0.5,
        0.5 - (event.clientY - rect.top) / rect.height);
    };
    const leave = () => pointer.current.set(0, 0);
    const click = (event: MouseEvent) => {
      hero.style.setProperty("--hero-effect-color", warm ? "#ff681f" : "#4f8fff");
      const u = material.current?.uniforms;
      if (!reduced && u) {
        const rect = hero.getBoundingClientRect();
        u.uClick.value.set((event.clientX - rect.left) / rect.width,
          1 - (event.clientY - rect.top) / rect.height);
        u.uPulse.value = 3;
        u.uWarm.value = warm ? 1 : 0;
        const time = u.uShapeTime.value;
        u.uShapeTime.value = Math.max(time, Math.floor(time / 12) * 12 + 7);
        invalidate();
      }
      warm = !warm;
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("click", click);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("click", click);
      hero.style.removeProperty("--hero-effect-color");
    };
  }, [gl, invalidate, reduced]);

  useFrame(() => {
    if (!material.current) return;
    const u = material.current.uniforms;
    const now = performance.now();
    const delta = lastFrame.current ? Math.min((now - lastFrame.current) / 1000, 0.1) : 0;
    lastFrame.current = now;
    if (active && !reduced) {
      u.uTime.value += delta;
      u.uShapeTime.value += delta;
      u.uPulse.value = Math.max(0, u.uPulse.value - delta);
      u.uPointer.value.lerp(pointer.current, 1 - Math.exp(-delta * 3));
    }
    u.uAspect.value = size.width / Math.max(1, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader}
        fragmentShader={fragmentShader} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function HeroAurora() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [dpr, setDpr] = useState(0.65);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      setActive(visible && !document.hidden);
      setReduced(preference.matches);
    };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDpr(Math.min(0.65, 960 / Math.max(1, width), 720 / Math.max(1, height)));
    });
    intersection.observe(element);
    resize.observe(element);
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    update();
    return () => {
      intersection.disconnect(); resize.disconnect();
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Canvas frameloop="demand" dpr={dpr}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        fallback={<div className="hero-color-glow absolute inset-0" />}>
        <AuroraPlane active={active} reduced={reduced} />
      </Canvas>
    </div>
  );
}
