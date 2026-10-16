"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/** Feixes diagonais com movimento ambiente amplo e distorção local pelo mouse. */
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uEnergy;
  uniform float uReveal;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(vUv.x * aspect, vUv.y);

    // Mouse no mesmo espaço da cena
    vec2 m = vec2((uMouse.x * 0.5 + 0.5) * aspect, uMouse.y * 0.5 + 0.5);
    vec2 toM = p - m;
    float dM = length(toM);

    // Superfície líquida: cavidade sob o cursor e ondas ao redor.
    vec2 waterDirection = toM / max(dM, 0.001);
    float waterEnvelope = exp(-dM * 5.5) * uEnergy;
    float waterPhase = dM * 32.0 - uTime * 5.5;
    float waterSlope = (sin(waterPhase) * 0.55 - exp(-dM * 7.0)) * waterEnvelope;
    vec3 waterNormal = normalize(vec3(waterDirection * waterSlope * 2.4, 1.0));

    // A normal curva a imagem como se os feixes estivessem sob a água.
    p += waterNormal.xy * 0.13;
    p += waterDirection * sin(waterPhase * 0.57 + 0.8) * waterEnvelope * 0.035;

    vec2 alongDir = normalize(vec2(1.0, -1.0));
    vec2 acrossDir = normalize(vec2(1.0, 1.0));
    float a0 = dot(p, acrossDir);
    float l = dot(p, alongDir);
    float maxA = (aspect + 1.0) * 0.70710678;

    // Ondulação ampla e limitada: mantém os feixes na mesma região.
    float ambient = sin(l * 2.6 + uTime * 0.65) * 0.055
      + sin(l * 4.1 - uTime * 0.44) * 0.025;
    float a = a0 + ambient;

    vec3 orange = vec3(1.00, 0.12, 0.00);
    vec3 ember = vec3(1.00, 0.22, 0.01);
    vec3 blue   = vec3(0.16, 0.40, 1.00);
    vec3 cyan   = vec3(0.55, 0.82, 1.00);

    // Ciclo de 20 s: azul, transição, laranja e retorno ao azul.
    float colorTime = mod(uTime, 20.0);
    float lava = smoothstep(7.0, 10.0, colorTime) - smoothstep(17.0, 20.0, colorTime);
    vec3 baseColor = mix(blue, orange, lava);
    vec3 edgeColor = mix(cyan, ember, lava);

    vec3 col = vec3(0.0);
    const int N = 12;
    for (int i = 0; i < N; i++) {
      float fi = float(i);
      // Variação de largura em pares de feixes.
      float h1 = hash(floor(fi * 0.5) * 12.9898 + 1.3);
      float h2 = hash(fi * 78.233 + 4.1);
      float h3 = hash(fi * 39.425 + 7.7);

      float t = fi / float(N - 1);
      float center = maxA * (0.47 + t * 0.55) + sin(uTime * 0.48 + fi * 0.7) * 0.018;
      float width = 0.035 + h1 * 0.075;
      float x = (a - center) / width;

      // Corpo do feixe com borda brilhante de um lado
      float body = smoothstep(-1.25, -0.75, x) * (1.0 - smoothstep(0.92, 1.06, x));
      float grad = pow(clamp((x + 1.0) * 0.5, 0.0, 1.0), 1.6);
      float edge = exp(-pow((x - 1.0) * 5.0, 2.0));
      float glow = exp(-abs(x) * 0.9) * 0.22;
      float v = body * (0.18 + 0.82 * grad) + edge * 0.9 + glow;

      // Comprimentos fixos preservam o desenho diagonal da referência.
      float start = -0.55 + h2 * 0.5;
      float fade = smoothstep(start - 0.05, start + 0.45 + h3 * 0.3, l);
      float tail = 1.0 - smoothstep(aspect * 0.55 + h3 * 0.3, aspect * 0.9, l);
      v *= fade * tail;

      float reveal = smoothstep(t * 0.6, t * 0.6 + 0.4, uReveal);
      float brightness = 0.95;

      // Todos os feixes seguem a mesma cor ao longo do ciclo.
      vec3 c = mix(baseColor, edgeColor, edge * 0.24);
      c *= mix(1.12, 1.0, lava);
      col += c * v * brightness * reveal * (0.55 + h1 * 0.6);
    }

    // Máscara fixa no canto superior direito.
    float region = smoothstep(0.30, 0.68, a0 / maxA);
    vec2 corner = vec2(aspect * 0.78, 0.78);
    float radial = 1.0 - smoothstep(0.2, 1.25, length(p - corner));
    col *= region * (0.35 + 0.65 * radial) * 1.5;

    // Relevo: luz de um lado da onda e sombra do outro dão profundidade.
    vec3 lightDirection = normalize(vec3(-0.5, 0.65, 1.0));
    float waterLight = dot(waterNormal, lightDirection);
    float flatLight = lightDirection.z;
    col *= max(0.55, 1.0 + (waterLight - flatLight) * 2.2);
    float caustic = pow(max(0.0, cos(waterPhase)), 10.0) * waterEnvelope;
    col += mix(baseColor, edgeColor, 0.5) * caustic * 0.32 * region;
    float reflection = pow(max(0.0, dot(reflect(-lightDirection, waterNormal), vec3(0.0, 0.0, 1.0))), 32.0);
    col += edgeColor * reflection * waterEnvelope * 0.5 * region;

    col = 1.0 - exp(-col * 1.35);
    float n = fract(sin(dot(vUv * uRes + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col += (n - 0.5) * 0.025;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function BeamsPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport, gl } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const previous = useRef(new THREE.Vector2());
  const pointer = useRef(new THREE.Vector2());
  const energy = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2() },
      uEnergy: { value: 0 },
      uReveal: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    const hero = gl.domElement.closest<HTMLElement>("#topo");
    if (!hero) return;
    const move = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom) return;
      pointer.current.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        1 - ((event.clientY - rect.top) / rect.height) * 2
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [gl]);

  useFrame((_, delta) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value += delta;

    // Texto e fallback usam o mesmo relógio e a mesma curva de cor do shader.
    const colorTime = u.uTime.value % 20;
    const lava = THREE.MathUtils.smoothstep(colorTime, 7, 10)
      - THREE.MathUtils.smoothstep(colorTime, 17, 20);
    const hero = gl.domElement.closest<HTMLElement>("#topo");
    hero?.style.setProperty(
      "--hero-effect-color",
      `rgb(${Math.round(47 + (255 - 47) * lava)}, ${Math.round(107 + (60 - 107) * lava)}, ${Math.round(255 * (1 - lava))})`
    );
    u.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
    u.uReveal.value = Math.min(1, u.uReveal.value + delta * 0.55);

    // O cursor é seguido com atraso; a velocidade vira "energia" e decai sozinha
    mouse.current.lerp(pointer.current, 1 - Math.exp(-10 * delta));
    const speed = mouse.current.distanceTo(previous.current) / Math.max(delta, 0.001);
    previous.current.copy(mouse.current);
    energy.current += (Math.min(speed * 0.35, 1.2) - energy.current) * Math.min(delta * 2.2, 1);

    u.uMouse.value.copy(mouse.current);
    u.uEnergy.value = energy.current;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function HeroBeams() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      className="!absolute inset-0"
    >
      <BeamsPlane />
    </Canvas>
  );
}
