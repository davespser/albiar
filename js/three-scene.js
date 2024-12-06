// Importa Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { database } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Variables globales
let scene, camera, renderer;
let cube, floor;
let touchStartX = 0, touchStartY = 0;
let touchMoveX = 0, touchMoveY = 0;
let speed = 0.1;
let cameraOffset = { x: 0, y: 5, z: 10 };
let username = "Explorador"; // Cambiar según el nombre del usuario actual
let coordDiv;
let nameLabel;

// Inicializar la escena con datos del usuario
async function loadThreeScene(initialPosition = { x: 0, y: 0, z: 0 }) {
  // Obtener datos del personaje desde Firebase
  const userRef = ref(database, `players/${username}`);
  const snapshot = await get(userRef);

  let color = 0xff4500; // Color predeterminado
  let stats = { strength: 0.3, dexterity: 0.3, intelligence: 0.3 }; // Estadísticas predeterminadas

  if (snapshot.exists()) {
    const userData = snapshot.val();
    color = userData.color || color;
    stats = userData.stats || stats;
  }

  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Fondo azul cielo

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  updateCameraPosition(initialPosition);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.innerHTML = ""; // Limpiar la interfaz anterior
  document.body.appendChild(renderer.domElement);

  // Crear coordenadas en pantalla
  coordDiv = document.createElement("div");
  coordDiv.style.position = "absolute";
  coordDiv.style.top = "10px";
  coordDiv.style.left = "10px";
  coordDiv.style.color = "white";
  coordDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  coordDiv.style.padding = "10px";
  coordDiv.style.borderRadius = "10px";
  coordDiv.style.fontFamily = "'Comic Sans MS', cursive, sans-serif";
  coordDiv.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
  document.body.appendChild(coordDiv);

  // Agregar luz ambiental
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Agregar luz direccional
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Crear suelo con textura
  const floorTexture = new THREE.TextureLoader().load(
    "https://ipadg.ghom.cn/Public/threejs/examples/textures/terrain/grasslight-big.jpg"
  );
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(10, 10);
  const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
  const floorGeometry = new THREE.PlaneGeometry(50, 50);
  floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Crear cubo
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(initialPosition.x, initialPosition.y + 0.5, initialPosition.z);
  cube.castShadow = true;
  scene.add(cube);

  // Crear etiqueta de nombre encima del cubo
  const spriteMaterial = new THREE.SpriteMaterial({
    map: createTextTexture(username, 256, 64),
    transparent: true
  });
  nameLabel = new THREE.Sprite(spriteMaterial);
  nameLabel.position.set(0, 1.5, 0); // Posición encima del cubo
  nameLabel.scale.set(3, 0.75, 1);
  cube.add(nameLabel);

  // Mostrar estadísticas
  updateStats(stats);

  // Configurar eventos táctiles
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", handleTouchEnd);

  // Iniciar animación
  animate();
}

// Mostrar estadísticas en pantalla
function updateStats(stats) {
  coordDiv.innerHTML = `
    <strong>Estadísticas:</strong><br>
    Fuerza: ${(stats.strength * 100).toFixed(0)}<br>
    Destreza: ${(stats.dexterity * 100).toFixed(0)}<br>
    Inteligencia: ${(stats.intelligence * 100).toFixed(0)}
  `;
}

// El resto de las funciones (updateCameraPosition, handleTouch, animate, etc.) se mantienen igual...
