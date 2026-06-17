"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticleCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ── Scene / camera ──────────────────────────── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4.5;

    /* ── Particles ───────────────────────────────── */
    const COUNT = 7000;
    const positions = new Float32Array(COUNT * 3);
    const homePos = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const velocities: THREE.Vector3[] = Array.from(
      { length: COUNT },
      () => new THREE.Vector3()
    );

    for (let i = 0; i < COUNT; i++) {
      /* Fibonacci sphere distribution — even spread */
      const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.6 + Math.random() * 1.2;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      homePos[i * 3] = x;
      homePos[i * 3 + 1] = y;
      homePos[i * 3 + 2] = z;
      sizes[i] = Math.random() * 2.5 + 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    /* ── Custom shaders ──────────────────────────── */
    const vertexShader = /* glsl */ `
      attribute float size;
      uniform float uTime;
      varying float vAlpha;

      void main() {
        float wave = sin(uTime * 0.4 + position.x * 1.2 + position.y * 0.8) * 0.5 + 0.5;
        vAlpha = 0.35 + 0.45 * wave;

        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (380.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const fragmentShader = /* glsl */ `
      varying float vAlpha;

      void main() {
        vec2 uv = gl_PointCoord.xy - vec2(0.5);
        float dist = dot(uv, uv);
        if (dist > 0.25) discard;
        float alpha = (0.25 - dist) * 4.0 * vAlpha;
        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    /* ── Mouse tracking ──────────────────────────── */
    const mouse = new THREE.Vector3(99, 99, 0);

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = ((e.clientX / window.innerWidth) * 2 - 1) * 3.5;
      mouse.y = (-(e.clientY / window.innerHeight) * 2 + 1) * 2.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Animation loop ──────────────────────────── */
    const clock = new THREE.Clock();
    let raf: number;
    const posArr = geometry.attributes.position.array as Float32Array;

    const SPRING = 0.018;
    const DAMPING = 0.87;
    const REPULSE_RADIUS = 1.1;
    const REPULSE_FORCE = 0.1;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      points.rotation.y = t * 0.06;
      points.rotation.x = Math.sin(t * 0.03) * 0.15;

      for (let i = 0; i < COUNT; i++) {
        const ix = i * 3;
        const px = posArr[ix];
        const py = posArr[ix + 1];
        const pz = posArr[ix + 2];

        /* Spring toward home */
        velocities[i].x += (homePos[ix] - px) * SPRING;
        velocities[i].y += (homePos[ix + 1] - py) * SPRING;
        velocities[i].z += (homePos[ix + 2] - pz) * SPRING;
        velocities[i].multiplyScalar(DAMPING);

        /* Mouse repulsion */
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPULSE_RADIUS && dist > 0.001) {
          const force = (1 - dist / REPULSE_RADIUS) * REPULSE_FORCE;
          velocities[i].x += (dx / dist) * force;
          velocities[i].y += (dy / dist) * force;
          velocities[i].z += force * 0.4;
        }

        posArr[ix] = px + velocities[i].x;
        posArr[ix + 1] = py + velocities[i].y;
        posArr[ix + 2] = pz + velocities[i].z;
      }
      geometry.attributes.position.needsUpdate = true;

      material.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    };
    animate();

    /* ── Resize ──────────────────────────────────── */
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
