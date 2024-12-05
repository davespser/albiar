// Importa Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

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

// Inicializar la escena
function loadThreeScene(initialPosition = { x: 0, y: 0, z: 0 }) {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Fondo azul cielo

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  updateCameraPosition(initialPosition);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
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

  // Crear cubo con animación
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0xff4500 }); // Naranja brillante
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

  // Configurar eventos táctiles
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", handleTouchEnd);

  // Iniciar animación
  animate();
}

// Actualizar posición de la cámara para tercera persona
function updateCameraPosition(targetPosition) {
  camera.position.set(
    targetPosition.x + cameraOffset.x,
    targetPosition.y + cameraOffset.y,
    targetPosition.z + cameraOffset.z
  );
  camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
}

// Crear textura de texto
function createTextTexture(text, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(0, 0, width, height);
  context.font = "30px Comic Sans MS";
  context.fillStyle = "yellow";
  context.textAlign = "center";
  context.fillText(text, width / 2, height / 2 + 10);
  return new THREE.CanvasTexture(canvas);
}

// Manejar inicio del toque
function handleTouchStart(event) {
  if (event.touches.length === 1) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  }
}

// Manejar movimiento del toque
function handleTouchMove(event) {
  if (event.touches.length === 1) {
    touchMoveX = event.touches[0].clientX;
    touchMoveY = event.touches[0].clientY;
  }
}

// Manejar fin del toque
function handleTouchEnd() {
  const deltaX = touchMoveX - touchStartX;
  const deltaY = touchMoveY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Movimiento horizontal
    if (deltaX > 0) {
      cube.position.x += speed; // Mover a la derecha
    } else {
      cube.position.x -= speed; // Mover a la izquierda
    }
  } else {
    // Movimiento vertical
    if (deltaY > 0) {
      cube.position.z += speed; // Mover hacia atrás
    } else {
      cube.position.z -= speed; // Mover hacia adelante
    }
  }

  // Actualizar cámara en tercera persona
  updateCameraPosition(cube.position);

  // Actualizar coordenadas
  updateCoordinates();

  // Resetear variables táctiles
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
}

// Actualizar coordenadas en pantalla
function updateCoordinates() {
  coordDiv.innerText = `🧭 Coordenadas: X=${cube.position.x.toFixed(2)}, Y=${cube.position.y.toFixed(2)}, Z=${cube.position.z.toFixed(2)}`;
}

// Animar escena
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  updateCoordinates();
  rotateCube();
}

// Rotación continua del cubo
function rotateCube() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

// Desmontar escena
function unloadThreeScene() {
  if (renderer) {
    renderer.domElement.remove();
    renderer.dispose();
  }
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("touchend", handleTouchEnd);
}

export { loadThreeScene, unloadThreeScene };
    
