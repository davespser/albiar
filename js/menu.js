// Importar Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Crear la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un plano para el menú
const planeGeometry = new THREE.PlaneGeometry(2, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, -1, -5);
scene.add(plane);

// Crear un canvas y dibujar el menú
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");
canvas.width = 256;
canvas.height = 128;

context.fillStyle = "#ffffff";
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = "#000000";
context.font = "20px Arial";
context.fillText("Opción 1", 10, 30);
context.fillText("Opción 2", 10, 60);
context.fillText("Opción 3", 10, 90);

const texture = new THREE.CanvasTexture(canvas);
planeMaterial.map = texture;
planeMaterial.needsUpdate = true;

// Crear un raycaster para detectar clics
const raycaster = new THREE.Raycaster();

// Función para detectar clics y ejecutar acciones
function onMouseClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([plane]);

  if (intersects.length > 0) {
    console.log("Has hecho clic en el plano");
  }
}

window.addEventListener("click", onMouseClick);

// Agregar un botón de animación al DOM
const menuButton = document.createElement("button");
menuButton.id = "menu-button";
menuButton.innerText = "Mostrar Menú";
menuButton.style.position = "absolute";
menuButton.style.top = "10px";
menuButton.style.left = "10px";
menuButton.style.padding = "10px 20px";
menuButton.style.cursor = "pointer";
menuButton.style.fontSize = "16px";
document.body.appendChild(menuButton);

// Animación sencilla con CSS
menuButton.addEventListener("click", () => {
  plane.scale.x = plane.scale.x === 1 ? 2 : 1;
  plane.scale.y = plane.scale.y === 1 ? 2 : 1;
});

// Función de renderizado
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
