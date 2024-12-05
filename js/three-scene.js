// Importa Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Variables globales
let scene, camera, renderer;
let cube, floor;
let touchStartX = 0, touchStartY = 0;
let touchMoveX = 0, touchMoveY = 0;
let speed = 0.1;
let cameraOffset = { x: 0, y: 5, z: 10 };

// Inicializar la escena
function loadThreeScene(initialPosition = { x: 0, y: 0, z: 0 }) {
  // Crear escena
  scene = new THREE.Scene();

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  updateCameraPosition(initialPosition);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Agregar luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Crear suelo
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Crear cubo
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(initialPosition.x, initialPosition.y + 0.5, initialPosition.z);
  scene.add(cube);

  // Configurar eventos táctiles
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", handleTouchEnd);

  // Iniciar animación
  animate();
}

// Actualizar posición de la cámara para tercera persona
function updateCameraPosition(targetPosition) {
  camera.position.set(
    targetPosition.x + cameraOffset.x,
    targetPosition.y + cameraOffset.y,
    targetPosition.z + cameraOffset.z
  );
  camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
}

// Manejar inicio del toque
function handleTouchStart(event) {
  if (event.touches.length === 1) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }
}

// Manejar movimiento del toque
function handleTouchMove(event) {
  if (event.touches.length === 1) {
    touchMoveX = event.touches[0].clientX;
    touchMoveY = event.touches[0].clientY;
  }
}

// Manejar fin del toque
function handleTouchEnd() {
  const deltaX = touchMoveX - touchStartX;
  const deltaY = touchMoveY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Movimiento horizontal
    if (deltaX > 0) {
      cube.position.x += speed; // Mover a la derecha
    } else {
      cube.position.x -= speed; // Mover a la izquierda
    }
  } else {
    // Movimiento vertical
    if (deltaY > 0) {
      cube.position.z += speed; // Mover hacia atrás
    } else {
      cube.position.z -= speed; // Mover hacia adelante
    }
  }

  // Actualizar cámara en tercera persona
  updateCameraPosition(cube.position);

  // Resetear variables táctiles
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
}

// Animar escena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Desmontar escena
function unloadThreeScene() {
  if (renderer) {
    renderer.domElement.remove();
    renderer.dispose();
  }
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("touchend", handleTouchEnd);
}

export { loadThreeScene, unloadThreeScene };
