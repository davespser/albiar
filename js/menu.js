// Importar Three.js y GSAP
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.11.5/dist/gsap.min.js';

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

// Crear el menú HTML y renderizarlo en un canvas
const menuContainer = document.createElement('div');
menuContainer.innerHTML = /* Aquí va el HTML de tu menú */ `<ul>
  <li>Opción 1</li>
  <li>Opción 2</li>
  <li>Opción 3</li>
</ul>`;
document.body.appendChild(menuContainer);

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = menuContainer.offsetWidth;
canvas.height = menuContainer.offsetHeight;
context.draw(menuContainer);

const texture = new THREE.CanvasTexture(canvas);
planeMaterial.map = texture;

// Crear un raycaster para detectar clicks
const raycaster = new THREE.Raycaster();

// Función para detectar clicks y ejecutar acciones
function onMouseClick(event) {
  // Convertir las coordenadas del mouse a coordenadas 3D
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Comprobar si el rayo intersecta con el plano
  const intersects = raycaster.intersectObjects([plane]);

  if (intersects.length > 0) {
    // Obtener la posición del clic en el plano
    const intersectPoint = intersects[0].point;

    // Aquí puedes agregar la lógica para determinar qué opción del menú se ha seleccionado
    // Basándote en la posición de intersectPoint

    // Ejemplo:
    console.log('Has hecho clic en la opción:', obtenerOpcionSeleccionada(intersectPoint));
  }
}

window.addEventListener('click', onMouseClick);

// Función para animar el menú
function animateMenu() {
  gsap.to(plane.scale, {
    x: 2,
    duration: 0.5,
    ease: "power2.out"
  });
}

// Obtener el botón del menú
const menuButton = document.getElementById('menu-button');

// Agregar un evento de clic al botón
menuButton.addEventListener('click', animateMenu);

// Función de renderizado
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
