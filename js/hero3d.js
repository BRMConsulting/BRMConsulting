/* Hero 3D: three interlocking rings (Balance, Resilience, Modernization) around a core,
   with orbiting data points. Falls back silently if WebGL is unavailable. */
import * as THREE from "../assets/vendor/three.module.min.js";

const canvas = document.getElementById("hero3d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(4, 6, 8); scene.add(dl);

  const group = new THREE.Group(); scene.add(group);
  const mk = (color, rx, ry) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.16, 32, 140),
      new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.1 }));
    m.rotation.set(rx, ry, 0); group.add(m); return m;
  };
  const rings = [mk(0x7fcf9e, 0, 0), mk(0x6fbfe8, Math.PI / 2.6, 0.4), mk(0xf0a3b6, -Math.PI / 2.6, -0.4)];
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.75, 1),
    new THREE.MeshStandardMaterial({ color: 0xfff3b0, roughness: 0.4, flatShading: true }));
  group.add(core);
  const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 1),
    new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true, transparent: true, opacity: 0.25 }));
  group.add(wire);

  // orbiting data points
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0x111111 }));
    s.userData = { r: 2.8 + Math.random() * 1.4, a: Math.random() * Math.PI * 2, sp: 0.15 + Math.random() * 0.35, tilt: (Math.random() - 0.5) * 1.6 };
    group.add(s); pts.push(s);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize); resize();

  let mx = 0, my = 0;
  window.addEventListener("pointermove", e => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; });

  const clock = new THREE.Clock();
  function frame() {
    const t = clock.getElapsedTime();
    rings[0].rotation.y = t * 0.35; rings[1].rotation.z = t * 0.28; rings[2].rotation.z = -t * 0.3;
    core.rotation.y = t * 0.5; core.rotation.x = t * 0.2; wire.rotation.y = -t * 0.3;
    pts.forEach(p => { const u = p.userData; const a = u.a + t * u.sp;
      p.position.set(Math.cos(a) * u.r, Math.sin(a) * u.r * Math.sin(u.tilt), Math.sin(a) * u.r * Math.cos(u.tilt)); });
    group.rotation.y += (mx * 0.6 - group.rotation.y) * 0.04;
    group.rotation.x += (my * 0.4 - group.rotation.x) * 0.04;
    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
} catch (e) {
  canvas.style.display = "none";
}
