"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function WireframeSphere({ size = 200 }: { size?: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 3.5;

    /* Icosahedron + wireframe */
    const geo = new THREE.IcosahedronGeometry(1.2, 3);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    /* Inner point cloud */
    const ptGeo = new THREE.BufferGeometry();
    const verts = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 0.5 + Math.random() * 0.5;
      verts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      verts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      verts[i * 3 + 2] = r * Math.cos(phi);
    }
    ptGeo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    const ptMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.3,
    });
    scene.add(new THREE.Points(ptGeo, ptMat));

    const clock = new THREE.Clock();
    let raf: number;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.rotation.y = t * 0.18;
      mesh.rotation.x = t * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      ptGeo.dispose();
      ptMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className="opacity-60"
    />
  );
}
