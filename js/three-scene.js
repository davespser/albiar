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
export function loadThreeScene({ x = 0, y = 0, z = 0, color = 0xff4500, stats = { strength: 0, dexterity: 0, intelligence: 0 } }) {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(x + 10, y + 5, z + 10);
  camera.lookAt(x, y, z);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.innerHTML = ""; // Limpiar la interfaz anterior
  document.body.appendChild(renderer.domElement);

  // Crear cubo con el color del personaje
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y + 0.5, z);
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
  statsDiv.innerHTML = `
    <strong>Estadísticas del Personaje:</strong><br>
    Fuerza: ${(stats.strength * 100).toFixed(0)}<br>
    Destreza: ${(stats.dexterity * 100).toFixed(0)}<br>
    Inteligencia: ${(stats.intelligence * 100).toFixed(0)}
  `;
  document.body.appendChild(statsDiv);

  // Iniciar animación
  animate();
}
