// script.js
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// ... (resto de tu código Three.js)

// Crear un canvas HTML para renderizar el menú
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Ajustar el tamaño del canvas para que coincida con el tamaño del menú
canvas.width = menuContainer.offsetWidth;
canvas.height = menuContainer.offsetHeight;

// Renderizar el menú en el canvas
context.draw(menuContainer);

// Crear una textura a partir del canvas
const texture = new THREE.CanvasTexture(canvas);

// Crear un plano y aplicar la textura
const planeGeometry = new THREE.PlaneGeometry(2, 1);
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// Posicionar el plano (ajusta estos valores según tus necesidades)
plane.position.set(0, -1, -5);

// Escalar el plano para que coincida con el tamaño de la textura
plane.scale.set(0.5, 0.5, 1);
// Posicionar el plano en la escena
scene.add(plane);

// Crear un raycaster
const raycaster = new THREE.Raycaster();

// Función para detectar clics
function onMouseClick(event) {
    // ... (código para detectar la intersección con el plano y ejecutar acciones)
}

window.addEventListener('click', onMouseClick, false);

// ... (resto de tu código Three.js)

// Obtener el botón del menú
const menuButton = document.getElementById('menu-button');

// Agregar un evento de clic al botón
menuButton.addEventListener('click', () => {
    // Aquí puedes agregar la lógica para desplegar el menú
    // Por ejemplo, puedes animar el plano para que se expanda
    // o mostrar/ocultar elementos del menú
});
// ... (resto de tu código Three.js)
menuButton.addEventListener('click', () => {
    gsap.to(plane.scale, {
        x: 2, // Escala en el eje X a 2
        duration: 0.5, // Duración de la animación en segundos
        ease: "power2.out" // Tipo de easing para la animación
    });
});
gsap.to(plane.scale, {
    x: 2,
    duration: 0.5,
    ease: "power2.out"
});
