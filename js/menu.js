// Importar Three.js y GSAP
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.11.5/dist/gsap.min.js";

// Crear la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un plano para el menú
const planeGeometry = new THREE.PlaneGeometry(2, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Color de fondo del menú
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

// Función para animar el menú
function animateMenu() {
  gsap.to(plane.scale, {
    x: 2,
    duration: 0.5,
    ease: "power2.out"
  });
}

// Crear un botón para activar la animación del menú
const menuButton = document.createElement("button");
menuButton.id = "menu-button";
menuButton.innerText = "Mostrar Menú";
menuButton.style.position = "absolute";
menuButton.style.top = "10px";
menuButton.style.left = "10px";
document.body.appendChild(menuButton);

menuButton.addEventListener("click", animateMenu);

// Función de renderizado
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
