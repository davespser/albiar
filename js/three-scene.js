import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js";

let scene, camera, renderer, cube;

export function loadThreeScene(initialPosition = { x: 0, y: 0, z: 0 }) {
  // Crear escena, cámara y renderizador
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Crear un cubo y agregarlo a la escena
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
  scene.add(cube);

  camera.position.z = 5;

  // Animar la escena
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  console.log("Escena de Three.js cargada.");
}

export function unloadThreeScene() {
  if (renderer) {
    renderer.dispose();
    document.body.removeChild(renderer.domElement);
    renderer = null;
    console.log("Escena de Three.js descargada.");
  }
}
