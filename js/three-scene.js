// Importar Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js";

// Importar OrbitControls
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/controls/OrbitControls.js";

// Importar la base de datos para actualizar estadísticas
import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

let scene, camera, renderer, cube, userId;

// Cargar la escena principal
export function loadThreeScene(position) {
  userId = position.userId;
  initScene(position);
  animate();
}

// Inicializar la escena
function initScene(position) {
  // Configuración básica
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.innerHTML = ""; // Limpiar la interfaz anterior
  document.body.appendChild(renderer.domElement);

  // Crear el cubo
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: position.color });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  scene.add(cube);

  // Mostrar las estadísticas sobre el cubo
  const statsDiv = document.createElement("div");
  statsDiv.id = "stats";
  statsDiv.style.position = "absolute";
  statsDiv.style.top = "10px";
  statsDiv.style.left = "10px";
  statsDiv.style.color = "white";
  statsDiv.style.fontFamily = "Arial";
  document.body.appendChild(statsDiv);

  updateStats();

  // Posicionar la cámara
  camera.position.z = 5;

  // Controles de tercera persona
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target = cube.position;
}

// Actualizar estadísticas sobre el cubo
function updateStats() {
  get(ref(database, `players/${userId}/stats`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const stats = snapshot.val();
        document.getElementById("stats").innerHTML = `
          <strong>Estadísticas del Personaje:</strong><br>
          Fuerza: ${Math.round(stats.strength * 100)}<br>
          Destreza: ${Math.round(stats.dexterity * 100)}<br>
          Inteligencia: ${Math.round(stats.intelligence * 100)}
        `;
      }
    })
    .catch((error) => {
      console.error("Error al obtener estadísticas:", error.message);
    });
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
