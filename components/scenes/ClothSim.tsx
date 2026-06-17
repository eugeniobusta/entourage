"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   SCENE 02 — Silk cloth simulation (PBD)
   White fabric hangs from top edge in darkness, gently swaying
───────────────────────────────────────────────────────────────*/

const COLS = 30;
const ROWS = 22;
const SPACING = 0.17;
const GRAVITY = 0.0012;
const DAMPING = 0.985;
const ITERATIONS = 6;

type Particle = { pos: THREE.Vector3; prev: THREE.Vector3; pinned: boolean };
type Spring = { a: number; b: number; rest: number };

export function ClothSim() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;
    mount.appendChild(renderer.domElement);

    /* ── Scene / camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 7);
    camera.lookAt(0, -0.5, 0);

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(2, 4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xccccff, 0.6);
    fill.position.set(-3, 0, 2);
    scene.add(fill);

    /* ── Cloth particles ── */
    const particles: Particle[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - (COLS - 1) / 2) * SPACING;
        const y = -r * SPACING + (ROWS / 2) * SPACING;
        const z = (Math.random() - 0.5) * 0.01; // tiny z-jitter for stability
        const p = new THREE.Vector3(x, y, z);
        particles.push({ pos: p.clone(), prev: p.clone(), pinned: r === 0 });
      }
    }

    /* ── Springs ── */
    const springs: Spring[] = [];
    const addSpring = (a: number, b: number) => {
      const rest = particles[a].pos.distanceTo(particles[b].pos);
      springs.push({ a, b, rest });
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (c < COLS - 1) addSpring(i, i + 1);         // structural horizontal
        if (r < ROWS - 1) addSpring(i, i + COLS);       // structural vertical
        if (c < COLS - 1 && r < ROWS - 1) {             // shear
          addSpring(i, i + COLS + 1);
          addSpring(i + 1, i + COLS);
        }
        if (c < COLS - 2) addSpring(i, i + 2);          // bend horizontal
        if (r < ROWS - 2) addSpring(i, i + COLS * 2);   // bend vertical
      }
    }

    /* ── Geometry ── */
    const posArr = new Float32Array(particles.length * 3);
    const indices: number[] = [];
    for (let r = 0; r < ROWS - 1; r++) {
      for (let c = 0; c < COLS - 1; c++) {
        const i = r * COLS + c;
        indices.push(i, i + 1, i + COLS, i + 1, i + COLS + 1, i + COLS);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    geometry.setIndex(indices);

    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      shininess: 90,
      specular: new THREE.Color(0x444444),
    });

    scene.add(new THREE.Mesh(geometry, material));

    /* ── Physics update ── */
    const updateCloth = (t: number) => {
      /* Verlet integration */
      for (const p of particles) {
        if (p.pinned) continue;
        const vel = p.pos.clone().sub(p.prev).multiplyScalar(DAMPING);
        p.prev.copy(p.pos);
        p.pos.add(vel);
        p.pos.y -= GRAVITY;
        /* Wind */
        p.pos.x += Math.sin(t * 0.8 + p.pos.y * 3.0) * 0.00055;
        p.pos.z += Math.cos(t * 0.6 + p.pos.x * 2.5) * 0.00035;
      }

      /* Constraint solving */
      for (let iter = 0; iter < ITERATIONS; iter++) {
        for (const s of springs) {
          const pa = particles[s.a];
          const pb = particles[s.b];
          const delta = pb.pos.clone().sub(pa.pos);
          const dist = delta.length();
          if (dist < 0.0001) continue;
          const corr = delta.multiplyScalar((dist - s.rest) / dist * 0.5);
          if (!pa.pinned) pa.pos.add(corr);
          if (!pb.pinned) pb.pos.sub(corr);
        }
      }

      /* Write to geometry */
      for (let i = 0; i < particles.length; i++) {
        posArr[i * 3] = particles[i].pos.x;
        posArr[i * 3 + 1] = particles[i].pos.y;
        posArr[i * 3 + 2] = particles[i].pos.z;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    /* ── Camera gentle sway ── */
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      updateCloth(t);
      camera.position.x = Math.sin(t * 0.08) * 0.5;
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
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
