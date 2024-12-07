import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Variables globales
let scene, camera, renderer;
let cube, floor;
let speed = 0.02; // Velocidad del cubo basada en la estadística "speed"

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
  const floorTexture = new THREE.TextureLoader().load("./js/grasslight-big.png");
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
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.9,
    roughness: 0.1,
    specular: 0xffffff,
  });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y + 0.5, z);
  cube.castShadow = true;
  scene.add(cube);

  // Crear menú superpuesto
  createMenu();

  // Crear el joypad
  createJoypad();

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
  speed = stats.speed ? stats.speed / 100 : 0.5;

  // Configurar eventos de teclado para mover el cubo
  window.addEventListener("keydown", handleKeyDown);

  // Iniciar animación
  animate();
}

// Crear menú superpuesto
function createMenu() {
  // Cargar estilos del menú
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "./js/style.css"; // Ruta del archivo CSS del menú
  document.head.appendChild(link);

  // Crear el contenedor del menú
  const menuContainer = document.createElement("div");
  menuContainer.id = "menu-container";
  menuContainer.innerHTML = `
    <div class="menu-item" data-action="option1">
      <span>🔧</span> Opción 1
    </div>
    <div class="menu-item" data-action="option2">
      <span>🎵</span> Opción 2
    </div>
    <div class="menu-item" data-action="option3">
      <span>📷</span> Opción 3
    </div>
    <div class="menu-item" data-action="option4">
      <span>⚙️</span> Opción 4
    </div>
  `;
  document.body.appendChild(menuContainer);

  // Manejar clics en las opciones del menú
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.getAttribute("data-action");
      console.log(`Has seleccionado: ${action}`);
      // Añade lógica personalizada aquí
    });
  });
}

// Crear joypad
function createJoypad() {
  const joypadBase = document.createElement("div");
  joypadBase.style.position = "absolute";
  joypadBase.style.bottom = "10%";
  joypadBase.style.left = "5%";
  joypadBase.style.width = "15%";
  joypadBase.style.height = joypadBase.style.width;
  joypadBase.style.border = "2px solid white";
  joypadBase.style.borderRadius = "50%";
  joypadBase.style.background = "rgba(255, 255, 255, 0.2)";
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = "40%";
  joypadStick.style.height = joypadStick.style.width;
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = `translate(30%, 30%)`;
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Eventos de interacción
  joypadBase.addEventListener("touchstart", (event) => {
    isDragging = true;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  joypadBase.addEventListener("touchmove", (event) => {
    if (!isDragging) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    cube.position.x += deltaX * 0.005; // Ajustar sensibilidad
    cube.position.z += deltaY * 0.005;
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
  });
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
