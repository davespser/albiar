// Archivo: three-scene.js

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Variables globales
let scene, camera, renderer;
let cube, floor;
let speed = 0.1; // Velocidad del cubo basada en la estadística "speed"

// Función para cargar la escena principal
export function loadThreeScene({ x = 0, y = 0, z = 0, color = 0xff4500, stats = {} }) {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Fondo azul cielo

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(x + 10, y + 5, z + 10);
  camera.lookAt(x, y, z);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.innerHTML = ""; // Limpiar la interfaz anterior
  document.body.appendChild(renderer.domElement);

  // Agregar luz ambiental
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Agregar luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Crear suelo con textura
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

  // Crear cubo con color del personaje
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y + 0.5, z);
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
  statsDiv.innerHTML = `
    <strong>Estadísticas del Personaje:</strong><br>
    Ataque: ${stats.attack?.toFixed(1) || 0}<br>
    Velocidad: ${stats.speed?.toFixed(1) || 0}<br>
    Magia: ${stats.magic?.toFixed(1) || 0}<br>
    Defensa: ${stats.defense?.toFixed(1) || 0}<br>
    Precisión: ${stats.precision?.toFixed(1) || 0}<br>
    Vitalidad: ${stats.vitality?.toFixed(1) || 0}<br>
  `;
  document.body.appendChild(statsDiv);

  // Configurar la velocidad basada en la estadística "speed"
  speed = stats.speed ? stats.speed / 100 : 0.1;

  // Configurar eventos de teclado para mover el cubo
  window.addEventListener("keydown", handleKeyDown);

  // Iniciar animación
  animate();
}

function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowUp":
      cube.position.z -= speed;
      break;
    case "ArrowDown":
      cube.position.z += speed;
      break;
    case "ArrowLeft":
      cube.position.x -= speed;
      break;
    case "ArrowRight":
      cube.position.x += speed;
      break;
  }
}

// Función para animar la escena
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
