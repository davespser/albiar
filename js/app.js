// Importa Firebase Database
import { database } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Configuración básica de Three.js
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";

// Crear la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("threeCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);

// Agregar un cubo a la escena
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Función de animación
function animate() {
  requestAnimationFrame(animate);

  // Rotar el cubo
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Actualizar el render
  renderer.render(scene, camera);

  // Guardar rotación en Firebase
  const dbRef = ref(database, "3DData");
  set(dbRef, { rotationX: cube.rotation.x, rotationY: cube.rotation.y });
}
animate();

// Ajustar el canvas al cambiar el tamaño de la ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
