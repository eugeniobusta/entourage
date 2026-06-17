"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   SCENE 01 — Star field / cosmos
   Particles distributed in 3D space, drifting slowly via shader,
   mouse creates a gentle parting effect (GPU-side, no CPU physics)
───────────────────────────────────────────────────────────────*/

export function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    );
    camera.position.z = 8;

    /* Distribute particles in a wide box */
    const COUNT = 3500;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT); // per-particle random seed

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      seeds[i] = Math.random() * 100;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));

    /* GPU-animated particles — everything in shader */
    const vertexShader = /* glsl */ `
      attribute float seed;
      uniform float uTime;
      uniform vec2  uMouse;  /* -1..1 ndc */
      varying float vAlpha;

      void main() {
        /* Slow organic drift */
        vec3 pos = position;
        pos.x += sin(uTime * 0.22 + seed * 1.7) * 0.18;
        pos.y += cos(uTime * 0.17 + seed * 2.3) * 0.12;
        pos.z += sin(uTime * 0.13 + seed * 1.1) * 0.10;

        /* Mouse repulsion in clip-space approximation */
        vec4 clip = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        vec2 ndc = clip.xy / clip.w;
        float d = distance(ndc, uMouse);
        if (d < 0.35) {
          float push = (0.35 - d) / 0.35;
          pos.xy += normalize(pos.xy - vec2(uMouse.x * 5.0, uMouse.y * 3.0)) * push * 0.5;
        }

        /* Fade by depth */
        vAlpha = 0.15 + 0.45 * (1.0 - abs(pos.z) / 7.0);
        vAlpha *= 0.6 + 0.4 * sin(uTime * 0.5 + seed * 3.14);

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (1.2 + seed * 0.8) * (300.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `;

    const fragmentShader = /* glsl */ `
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord.xy - 0.5;
        float d = dot(uv, uv);
        if (d > 0.25) discard;
        float a = (0.25 - d) * 4.0 * vAlpha;
        gl_FragColor = vec4(1.0, 1.0, 1.0, a);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(9, 9) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending, // NOT additive — prevents white blob
    });

    scene.add(new THREE.Points(geometry, material));

    /* Mouse tracking */
    const onMouseMove = (e: MouseEvent) => {
      material.uniforms.uMouse.value.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      );
    };
    window.addEventListener("mousemove", onMouseMove);

    /* Render loop */
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      material.uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
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
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
