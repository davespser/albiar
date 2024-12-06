// Importar Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Crear la escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un grupo para los elementos del menú
const menuGroup = new THREE.Group();
scene.add(menuGroup);

// Crear geometrías para cada ícono del menú
const createMenuOption = (color, positionY) => {
  const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
  const material = new THREE.MeshBasicMaterial({ color });
  const box = new THREE.Mesh(geometry, material);
  box.position.y = positionY;
  return box;
};

// Crear opciones del menú
const menuColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
menuColors.forEach((color, index) => {
  const option = createMenuOption(color, index * -0.5); // Separar cada opción
  menuGroup.add(option);
});

// Crear un plano de fondo
const planeGeometry = new THREE.PlaneGeometry(3, 10);

const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
const background = new THREE.Mesh(planeGeometry, planeMaterial);
background.position.z = -0.2;
background.rotation.y = 15;// Colocar detrás del menú
scene.add(background);

// Raycaster para detección de interacciones
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(menuGroup.children);

  menuGroup.children.forEach((child) => {
    child.material.color.set(0xffffff); // Resetear color
  });

  if (intersects.length > 0) {
    intersects[0].object.material.color.set(0x00ffff); // Cambiar color al pasar el ratón
  }
}

window.addEventListener("mousemove", onMouseMove);

// Función de renderizado
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
