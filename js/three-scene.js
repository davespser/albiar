// Importa Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Variables globales
let scene, camera, renderer;
let cube, floor;
let speed = 0.1;
let cameraOffset = { x: 0, y: 5, z: 10 };

// Cargar la escena principal
export function loadThreeScene(position) {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(position.x + cameraOffset.x, position.y + cameraOffset.y, position.z + cameraOffset.z);
  camera.lookAt(position.x, position.y, position.z);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.innerHTML = ""; // Limpiar la interfaz anterior
  document.body.appendChild(renderer.domElement);

  // Crear luz
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Crear suelo
  const floorTexture = new THREE.TextureLoader().load("https://threejs.org/examples/textures/grasslight-big.jpg");
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);

  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Crear cubo
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: position.color });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y + 0.5, position.z);
  cube.castShadow = true;
  scene.add(cube);

  // Mostrar estadísticas
  const statsDiv = document.createElement("div");
  statsDiv.style.position = "absolute";
  statsDiv.style.top = "10px";
  statsDiv.style.left = "10px";
  statsDiv.style.color = "white";
  statsDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  statsDiv.style.padding = "10px";
  statsDiv.style.borderRadius = "10px";
  statsDiv.style.fontFamily = "Arial, sans-serif";
  document.body.appendChild(statsDiv);

  updateStats(statsDiv, position.stats);

  // Iniciar animación
  animate();
}

// Actualizar estadísticas en pantalla
function updateStats(statsDiv, stats) {
  statsDiv.innerHTML = `
    <strong>Estadísticas del Personaje:</strong><br>
    Fuerza: ${(stats.strength * 100).toFixed(0)}<br>
    Destreza: ${(stats.dexterity * 100).toFixed(0)}<br>
    Inteligencia: ${(stats.intelligence * 100).toFixed(0)}
  `;
}

// Animar la escena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Desmontar la escena
export function unloadThreeScene() {
  if (renderer) {
    renderer.dispose();
    document.body.innerHTML = ""; // Limpiar la interfaz
  }
}
