"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   SCENE 02 — Silk cloth draped over a hidden form
   Position-Based Dynamics cloth with sphere collision.
   Think: car under a tarp. Something is under there.
───────────────────────────────────────────────────────────────*/

const COLS = 32;
const ROWS = 26;
const SPACING = 0.165;
const GRAVITY = 0.0011;
const DAMPING = 0.988;
const ITERATIONS = 8;
const WARMUP_STEPS = 320; // pre-settle before first render

/* Hidden form — torso-like collision spheres */
const FORM = [
  { x: 0,     y: 0.15,  z: -0.5,  r: 1.15 }, // chest/torso
  { x: -1.1,  y: 0.6,   z: -0.25, r: 0.44 }, // left shoulder
  { x:  1.1,  y: 0.6,   z: -0.25, r: 0.44 }, // right shoulder
  { x: 0,     y: -0.85, z: -0.32, r: 0.78 }, // hips
  { x: 0,     y: 1.0,   z: -0.18, r: 0.24 }, // neck
];

type Particle = { pos: THREE.Vector3; prev: THREE.Vector3; pinned: boolean };
type Spring   = { a: number; b: number; rest: number };

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
    mount.appendChild(renderer.domElement);

    /* ── Scene / camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      46,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, 7.5);
    camera.lookAt(0, -0.3, 0);

    /* ── Lighting ──────────────────────────────────────────
       Key from above-right, rim from behind — reveals the
       form's silhouette through the draping cloth.
    ─────────────────────────────────────────────────────── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.28));

    // Key — top right front, creates bright highlights on stretched cloth
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(2.5, 5, 4);
    scene.add(key);

    // Fill — left side, prevents harsh shadows
    const fill = new THREE.DirectionalLight(0xddeeff, 0.55);
    fill.position.set(-3, 1, 2);
    scene.add(fill);

    // Rim — from BEHIND the cloth, subtly halos the hidden form's outline
    const rim = new THREE.DirectionalLight(0xffffff, 0.7);
    rim.position.set(0, 2, -5);
    scene.add(rim);

    // Subtle bottom-front kick — lifts the lower drape
    const kick = new THREE.DirectionalLight(0xffffff, 0.3);
    kick.position.set(0.5, -3, 3);
    scene.add(kick);

    /* ── Cloth particles ── */
    const particles: Particle[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - (COLS - 1) / 2) * SPACING;
        const y = -r * SPACING + (ROWS / 2) * SPACING;
        const z = (Math.random() - 0.5) * 0.008;
        const p = new THREE.Vector3(x, y, z);
        particles.push({ pos: p.clone(), prev: p.clone(), pinned: r === 0 });
      }
    }

    /* ── Springs ── */
    const springs: Spring[] = [];
    const addSpring = (a: number, b: number) => {
      springs.push({ a, b, rest: particles[a].pos.distanceTo(particles[b].pos) });
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (c < COLS - 1) addSpring(i, i + 1);
        if (r < ROWS - 1) addSpring(i, i + COLS);
        if (c < COLS - 1 && r < ROWS - 1) {
          addSpring(i, i + COLS + 1);
          addSpring(i + 1, i + COLS);
        }
        if (c < COLS - 2) addSpring(i, i + 2);
        if (r < ROWS - 2) addSpring(i, i + COLS * 2);
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

    /* Silk-like material — strong specular so the form's ridges catch light */
    const material = new THREE.MeshPhongMaterial({
      color: 0xf2f2f2,
      shininess: 180,
      specular: new THREE.Color(0x888888),
      side: THREE.DoubleSide,
      transparent: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    /* ── Collision resolve ── */
    const resolveSpheres = () => {
      for (const p of particles) {
        if (p.pinned) continue;
        for (const s of FORM) {
          const dx = p.pos.x - s.x;
          const dy = p.pos.y - s.y;
          const dz = p.pos.z - s.z;
          const dist2 = dx * dx + dy * dy + dz * dz;
          if (dist2 < s.r * s.r && dist2 > 0.00001) {
            const dist = Math.sqrt(dist2);
            const nx = dx / dist, ny = dy / dist, nz = dz / dist;
            p.pos.x = s.x + nx * s.r;
            p.pos.y = s.y + ny * s.r;
            p.pos.z = s.z + nz * s.r;
          }
        }
      }
    };

    /* ── Physics step ── */
    let simTime = 0;
    const stepCloth = (wind: number) => {
      for (const p of particles) {
        if (p.pinned) continue;
        const vel = p.pos.clone().sub(p.prev).multiplyScalar(DAMPING);
        p.prev.copy(p.pos);
        p.pos.add(vel);
        p.pos.y -= GRAVITY;
        // Gentle wind
        p.pos.x += Math.sin(wind * 0.9 + p.pos.y * 2.8) * 0.00045;
        p.pos.z += Math.cos(wind * 0.6 + p.pos.x * 2.0) * 0.00030;
      }
      for (let iter = 0; iter < ITERATIONS; iter++) {
        for (const s of springs) {
          const pa = particles[s.a], pb = particles[s.b];
          const delta = pb.pos.clone().sub(pa.pos);
          const dist = delta.length();
          if (dist < 0.0001) continue;
          const corr = delta.multiplyScalar((dist - s.rest) / dist * 0.5);
          if (!pa.pinned) pa.pos.add(corr);
          if (!pb.pinned) pb.pos.sub(corr);
        }
        resolveSpheres();
      }
    };

    /* ── Pre-settle: run simulation BEFORE first render ── */
    for (let i = 0; i < WARMUP_STEPS; i++) {
      simTime += 0.016;
      stepCloth(simTime);
    }

    /* Write initial settled positions */
    const writeGeometry = () => {
      for (let i = 0; i < particles.length; i++) {
        posArr[i * 3]     = particles[i].pos.x;
        posArr[i * 3 + 1] = particles[i].pos.y;
        posArr[i * 3 + 2] = particles[i].pos.z;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();
    };

    /* ── Render loop ── */
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      simTime += 0.016;
      stepCloth(simTime);
      writeGeometry();
      // Very slow camera drift — reveals 3D depth of the draping
      camera.position.x = Math.sin(t * 0.07) * 0.6;
      camera.position.y = 0.5 + Math.cos(t * 0.05) * 0.15;
      camera.lookAt(0, -0.3, 0);
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
