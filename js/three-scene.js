import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// Variables globales
let scene, camera, renderer;
let cube, floor, robot;
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
const light = new THREE.PointLight(0xffffff, 1, 100);
scene.add(light);

// Hacer que la luz siga al cubo
function animate() {
  requestAnimationFrame(animate);

  // Actualizar la posición de la luz para que siempre esté encima del cubo
  light.position.copy(cube.position);
  light.position.y += 2; // Ajustar la altura para que la luz esté por encima del cubo

  renderer.render(scene, camera);
}
animate();
  const loader = new GLTFLoader();
  loader.load(
    "./models/npc/robotauro_walk.glb",
    (gltf) => {
      robot = gltf.scene;
      robot.position.set(x, y + 0.5, z);
      robot.scale.set(0.1, 0.1, 0.1); // Ajusta la escala si es necesario
      scene.add(robot);
    },
    undefined,
    (error) => {
      console.error("Error al cargar el modelo: ", error);
    }
  );
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
    metalness: 1,
    roughness: 0.1,
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
  link.href = "style.css"; // Ruta del archivo CSS del menú
  document.head.appendChild(link);

  // Crear el contenedor del menú
  const menuContainer = document.createElement("div");
  menuContainer.classList.add("menu-container");
  menuContainer.innerHTML = `
    <!-- Input checkbox oculto para manejar el estado -->
    <input type="checkbox" id="toggle" class="hidden-input">
    
    <!-- Botón principal del menú -->
    <label for="toggle" class="menu-item">
      <span>🔸</span> Menú
    </label>

    <!-- Contenido desplegable -->
    <div class="menu-content">
      <div class="menu-item" data-action="option1">
        <span>🔸</span> Opción 1
      </div>
      <div class="menu-item" data-action="option2">
        <span>🔸</span> Opción 2
      </div>
      <div class="menu-item" data-action="option3">
        <span>🔸</span> Opción 3
      </div>
      <div class="menu-item" data-action="option4">
        <span>🔸</span> Opción 4
      </div>
    </div>
  `;
  document.body.appendChild(menuContainer);

  // Manejar clics en las opciones del menú
  document.querySelectorAll(".menu-content .menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.getAttribute("data-action");
      console.log(`Has seleccionado: ${action}`);
      // Añade lógica personalizada aquí
    });
  });
}

// Llamar a la función para generar el menú
createMenu();
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
  joypadBase.style.touchAction = "none"; // Evita conflictos con gestos del navegador
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = "40%";
  joypadStick.style.height = joypadStick.style.width;
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = "translate(30%, 30%)";
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  const baseRect = joypadBase.getBoundingClientRect();

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

    // Limitar el movimiento del stick dentro del círculo
    const maxRadius = baseRect.width / 2;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxRadius);

    const angle = Math.atan2(deltaY, deltaX);
    const stickX = Math.cos(angle) * distance;
    const stickY = Math.sin(angle) * distance;

    joypadStick.style.transform = `translate(calc(50% + ${stickX}px - 50%), calc(50% + ${stickY}px - 50%))`;

    // Mover el objeto (cube)
    cube.position.x += (stickX / maxRadius) * 0.05; // Ajustar sensibilidad
    cube.position.z += (stickY / maxRadius) * 0.05;
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
    // Restablecer la posición del stick al centro
    joypadStick.style.transform = "translate(30%, 30%)";
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
