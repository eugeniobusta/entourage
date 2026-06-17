"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────
   STUDIO SCENE
   A 3D photo studio: white cyclorama backdrop, dark ceiling
   with hanging studio lights, concrete floor.
   A white silk cloth is draped over a hidden form in the centre.
   Renders white → text on the hero must be black.
───────────────────────────────────────────────────────────────*/

const COLS = 30;
const ROWS = 24;
const SPACING = 0.17;
const GRAVITY = 0.00105;
const DAMPING = 0.989;
const ITERATIONS = 8;
const WARMUP = 340;

const FORM = [
  { x: 0,    y: 0.3,  z: -0.45, r: 1.0  },
  { x:-1.0,  y: 0.65, z:-0.22,  r: 0.40 },
  { x: 1.0,  y: 0.65, z:-0.22,  r: 0.40 },
  { x: 0,    y:-0.75, z:-0.3,   r: 0.72 },
  { x: 0,    y: 0.95, z:-0.15,  r: 0.22 },
];

type P = { pos: THREE.Vector3; prev: THREE.Vector3; pinned: boolean };
type S = { a: number; b: number; rest: number };

export function StudioScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0xf4f4f6);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    /* ── Scene ── */
    const scene = new THREE.Scene();

    /* ── Camera — slightly low-angle looking into the cyc ── */
    const camera = new THREE.PerspectiveCamera(
      46,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.6, 9);
    camera.lookAt(0, -0.2, 0);

    /* ────────────────────────────────────────────────────────
       STUDIO ENVIRONMENT
    ──────────────────────────────────────────────────────── */

    /* ── Background: shader-gradient cyc (floor → white → dark ceiling) ── */
    const bgGeo = new THREE.PlaneGeometry(28, 20);
    const bgMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float y = vUv.y;
          // 0 = floor, 0.35 = cyc base, 0.65 = bright cyc, 0.82 = ceiling start
          vec3 floor_col  = vec3(0.48, 0.48, 0.50);
          vec3 cyc_base   = vec3(0.88, 0.89, 0.91);
          vec3 cyc_bright = vec3(0.97, 0.97, 0.99);
          vec3 ceil_col   = vec3(0.07, 0.07, 0.08);

          vec3 col;
          if (y < 0.30) {
            col = mix(floor_col, cyc_base, y / 0.30);
          } else if (y < 0.62) {
            col = mix(cyc_base, cyc_bright, (y - 0.30) / 0.32);
          } else if (y < 0.82) {
            col = cyc_bright;
          } else {
            col = mix(cyc_bright, ceil_col, (y - 0.82) / 0.18);
          }
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      depthWrite: false,
    });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.position.set(0, 1.5, -8);
    bg.renderOrder = -1;
    scene.add(bg);

    /* ── Side walls (dark, visible at edges) ── */
    const wallMat = new THREE.MeshBasicMaterial({ color: 0x080808 });
    const wallGeo = new THREE.PlaneGeometry(8, 20);
    const wallL = new THREE.Mesh(wallGeo, wallMat);
    wallL.position.set(-8, 1.5, -4);
    wallL.rotation.y = Math.PI / 2;
    scene.add(wallL);
    const wallR = new THREE.Mesh(wallGeo, wallMat.clone());
    wallR.position.set(8, 1.5, -4);
    wallR.rotation.y = -Math.PI / 2;
    scene.add(wallR);

    /* ── Ceiling ── */
    const ceilGeo = new THREE.PlaneGeometry(20, 12);
    ceilGeo.rotateX(Math.PI / 2);
    const ceil = new THREE.Mesh(ceilGeo, new THREE.MeshBasicMaterial({ color: 0x080808 }));
    ceil.position.set(0, 4.4, -2);
    scene.add(ceil);

    /* ── Structural truss beam ── */
    const beamGeo = new THREE.BoxGeometry(12, 0.06, 0.08);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x1a1a1a });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 4.3, -1.4);
    scene.add(beam);

    /* ── Studio light fixtures ── */
    const fixturePositions = [-3.8, -1.3, 1.3, 3.8];
    fixturePositions.forEach((fx) => {
      const fz = -1.3;
      const fy = 4.2;

      // Housing box
      const hGeo = new THREE.BoxGeometry(0.45, 0.18, 0.7);
      const hMat = new THREE.MeshPhongMaterial({ color: 0x1c1c1c });
      const house = new THREE.Mesh(hGeo, hMat);
      house.position.set(fx, fy, fz);
      scene.add(house);

      // Hanging rod
      const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35);
      const rod = new THREE.Mesh(rodGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
      rod.position.set(fx, fy + 0.26, fz);
      scene.add(rod);

      // Glowing emitter disc
      const glowGeo = new THREE.CircleGeometry(0.14, 16);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff8e4 });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(fx, fy - 0.1, fz);
      glow.rotation.x = -Math.PI / 2;
      scene.add(glow);

      // SpotLight
      const spot = new THREE.SpotLight(0xfff8f0, 3.2, 16, Math.PI / 8, 0.45, 1.4);
      spot.position.set(fx, fy - 0.1, fz);
      spot.castShadow = Math.abs(fx) < 2; // only center spots cast shadow
      spot.shadow.mapSize.set(512, 512);
      spot.shadow.camera.near = 0.5;
      spot.shadow.camera.far = 12;
      spot.target.position.set(fx * 0.2, -2, fz * 0.4);
      scene.add(spot);
      scene.add(spot.target);
    });

    /* ── Floor (ShadowMaterial — shows cloth shadow, background shows through) ── */
    const floorGeo = new THREE.PlaneGeometry(20, 16);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.18, transparent: true });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -2.1;
    floor.receiveShadow = true;
    scene.add(floor);

    /* ── Ambient light (low — the spots do the work) ── */
    scene.add(new THREE.AmbientLight(0xffffff, 0.32));

    /* ── Fill from front — keeps cloth readable ── */
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(0, 2, 6);
    scene.add(fill);

    /* ────────────────────────────────────────────────────────
       CLOTH SIMULATION (PBD)
    ──────────────────────────────────────────────────────── */
    const particles: P[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - (COLS - 1) / 2) * SPACING;
        const y = -r * SPACING + (ROWS / 2) * SPACING;
        const z = (Math.random() - 0.5) * 0.007;
        const p = new THREE.Vector3(x, y, z);
        particles.push({ pos: p.clone(), prev: p.clone(), pinned: r === 0 });
      }
    }

    const springs: S[] = [];
    const addSpring = (a: number, b: number) =>
      springs.push({ a, b, rest: particles[a].pos.distanceTo(particles[b].pos) });

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
        if (c < COLS - 1) addSpring(i, i + 1);
        if (r < ROWS - 1) addSpring(i, i + COLS);
        if (c < COLS - 1 && r < ROWS - 1) { addSpring(i, i + COLS + 1); addSpring(i + 1, i + COLS); }
        if (c < COLS - 2) addSpring(i, i + 2);
        if (r < ROWS - 2) addSpring(i, i + COLS * 2);
      }
    }

    const posArr = new Float32Array(particles.length * 3);
    const indices: number[] = [];
    for (let r = 0; r < ROWS - 1; r++)
      for (let c = 0; c < COLS - 1; c++) {
        const i = r * COLS + c;
        indices.push(i, i + 1, i + COLS, i + 1, i + COLS + 1, i + COLS);
      }

    const clothGeo = new THREE.BufferGeometry();
    clothGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
    clothGeo.setIndex(indices);

    /* Slightly warm silk white — pops against the cool cyc */
    const clothMat = new THREE.MeshPhongMaterial({
      color: 0xf8f4ef,
      shininess: 200,
      specular: new THREE.Color(0x999999),
      side: THREE.DoubleSide,
    });

    const clothMesh = new THREE.Mesh(clothGeo, clothMat);
    clothMesh.castShadow = true;
    clothMesh.receiveShadow = true;
    scene.add(clothMesh);

    /* ── Physics helpers ── */
    const resolveForm = () => {
      for (const p of particles) {
        if (p.pinned) continue;
        for (const s of FORM) {
          const dx = p.pos.x - s.x, dy = p.pos.y - s.y, dz = p.pos.z - s.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 < s.r * s.r && d2 > 1e-5) {
            const d = Math.sqrt(d2);
            p.pos.x = s.x + (dx / d) * s.r;
            p.pos.y = s.y + (dy / d) * s.r;
            p.pos.z = s.z + (dz / d) * s.r;
          }
        }
      }
    };

    let simT = 0;
    const step = (wind: number) => {
      for (const p of particles) {
        if (p.pinned) continue;
        const vel = p.pos.clone().sub(p.prev).multiplyScalar(DAMPING);
        p.prev.copy(p.pos);
        p.pos.add(vel);
        p.pos.y -= GRAVITY;
        p.pos.x += Math.sin(wind * 0.8 + p.pos.y * 2.5) * 0.00038;
        p.pos.z += Math.cos(wind * 0.55 + p.pos.x * 2.0) * 0.00025;
      }
      for (let it = 0; it < ITERATIONS; it++) {
        for (const s of springs) {
          const pa = particles[s.a], pb = particles[s.b];
          const d = pb.pos.clone().sub(pa.pos);
          const len = d.length();
          if (len < 0.0001) continue;
          const corr = d.multiplyScalar((len - s.rest) / len * 0.5);
          if (!pa.pinned) pa.pos.add(corr);
          if (!pb.pinned) pb.pos.sub(corr);
        }
        resolveForm();
      }
    };

    const writeGeo = () => {
      for (let i = 0; i < particles.length; i++) {
        posArr[i * 3] = particles[i].pos.x;
        posArr[i * 3 + 1] = particles[i].pos.y;
        posArr[i * 3 + 2] = particles[i].pos.z;
      }
      clothGeo.attributes.position.needsUpdate = true;
      clothGeo.computeVertexNormals();
    };

    /* Pre-settle */
    for (let i = 0; i < WARMUP; i++) { simT += 0.016; step(simT); }

    /* ── Render loop ── */
    let raf: number;
    const clock = new THREE.Clock();

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      simT += 0.016;
      step(simT);
      writeGeo();
      // Barely perceptible camera drift — reveals depth
      camera.position.x = Math.sin(t * 0.06) * 0.4;
      camera.lookAt(0, -0.2, 0);
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
      clothGeo.dispose();
      clothMat.dispose();
      bgGeo.dispose();
      bgMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
}
