// Importar Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Crear la escena principal
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Posicionar la cámara
camera.position.z = 5;

// Crear un objeto 3D de ejemplo en la escena
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animación básica de rotación del objeto
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Crear el menú HTML superpuesto
const menuContainer = document.createElement('div');
menuContainer.id = "menu-container";
menuContainer.innerHTML = `
  <ul id="menu">
    <li class="menu-item" data-action="option1">🔧 Opción 1</li>
    <li class="menu-item" data-action="option2">🎵 Opción 2</li>
    <li class="menu-item" data-action="option3">📷 Opción 3</li>
    <li class="menu-item" data-action="option4">⚙️ Opción 4</li>
  </ul>
`;
document.body.appendChild(menuContainer);

// Estilos CSS del menú (superposición)
const styles = document.createElement('style');
styles.innerHTML = `
  #menu-container {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    border-radius: 8px;
    z-index: 10; /* Siempre por encima */
  }

  #menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .menu-item {
    color: white;
    font-size: 18px;
    padding: 10px;
    cursor: pointer;
    transition: background 0.3s, transform 0.2s;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(10px);
  }
`;
document.head.appendChild(styles);

// Manejar eventos de clic en las opciones del menú
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', (event) => {
    const action = event.target.getAttribute('data-action');
    console.log(`Has seleccionado: ${action}`);
    // Aquí puedes añadir lógica personalizada según la opción seleccionada
  });
});
