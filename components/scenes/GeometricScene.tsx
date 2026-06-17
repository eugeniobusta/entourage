"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   SCENE 03 — Wireframe geometric sculpture
   Clean edge-only icosahedron + orbiting particle cloud.
   Contemporary, architectural, design-forward.
───────────────────────────────────────────────────────────────*/

export function GeometricScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 6;

    /* ── Outer icosahedron (edges only) ── */
    const icGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const edgesGeo = new THREE.EdgesGeometry(icGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    });
    const outerWire = new THREE.LineSegments(edgesGeo, edgesMat);
    scene.add(outerWire);

    /* ── Inner icosahedron (different rotation speed) ── */
    const innerIcGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const innerEdgesGeo = new THREE.EdgesGeometry(innerIcGeo);
    const innerEdgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
    });
    const innerWire = new THREE.LineSegments(innerEdgesGeo, innerEdgesMat);
    scene.add(innerWire);

    /* ── Orbiting particle ring ── */
    const RING_COUNT = 120;
    const ringPositions = new Float32Array(RING_COUNT * 3);
    const ringSeeds = new Float32Array(RING_COUNT);
    for (let i = 0; i < RING_COUNT; i++) {
      const angle = (i / RING_COUNT) * Math.PI * 2;
      const r = 2.9 + Math.random() * 0.4;
      const tilt = (Math.random() - 0.5) * 0.6;
      ringPositions[i * 3] = Math.cos(angle) * r;
      ringPositions[i * 3 + 1] = Math.sin(angle) * r * 0.35 + tilt;
      ringPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      ringSeeds[i] = Math.random() * 10;
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
    ringGeo.setAttribute("seed", new THREE.BufferAttribute(ringSeeds, 1));

    const ringVert = /* glsl */ `
      attribute float seed;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec3 pos = position;
        float pulse = sin(uTime * 1.2 + seed * 6.28) * 0.5 + 0.5;
        vAlpha = 0.2 + 0.6 * pulse;
        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (1.5 + seed * 1.0) * (200.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
      }
    `;
    const ringFrag = /* glsl */ `
      varying float vAlpha;
      void main() {
        vec2 uv = gl_PointCoord.xy - 0.5;
        if (dot(uv, uv) > 0.25) discard;
        gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha);
      }
    `;
    const ringMat = new THREE.ShaderMaterial({
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
    });
    const ring = new THREE.Points(ringGeo, ringMat);
    scene.add(ring);

    /* ── Scattered background stars ── */
    const STAR_COUNT = 800;
    const starPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 20;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.04,
      transparent: true,
      opacity: 0.25,
    });
    scene.add(new THREE.Points(starGeo, starMat));

    /* ── Mouse influence on rotation ── */
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── Animate ── */
    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      outerWire.rotation.y = t * 0.09 + mouseX * 0.15;
      outerWire.rotation.x = t * 0.05 + mouseY * 0.08;

      innerWire.rotation.y = -t * 0.14 + mouseX * 0.1;
      innerWire.rotation.x = t * 0.07;
      innerWire.rotation.z = t * 0.06;

      ring.rotation.y = t * 0.06 + mouseX * 0.05;
      ring.rotation.x = t * 0.03 + mouseY * 0.03;

      ringMat.uniforms.uTime.value = t;

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
      [icGeo, edgesGeo, innerIcGeo, innerEdgesGeo, ringGeo, starGeo].forEach((g) => g.dispose());
      [edgesMat, innerEdgesMat, ringMat, starMat].forEach((m) => m.dispose());
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
