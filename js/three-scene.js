// Importa Three.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";

// Variables globales
let scene, camera, renderer;
let cube, floor;

// Función para cargar la escena principal
export function loadThreeScene({ x = 0, y = 0, z = 0, color = 0xff4500, stats = { strength: 0, dexterity: 0, intelligence: 0 } }) {
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
  const material = new THREE.MeshStandardMaterial({ color });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y + 0.5, z);
  cube.castShadow = true;
  scene.add(cube);
// Crear el joypad
function createJoypad() {
  const joypadBase = document.createElement("div");
  joypadBase.style.position = "absolute";
  joypadBase.style.bottom = `${window.innerHeight * 0.1}px`; // 10% desde el borde inferior
  joypadBase.style.left = `${window.innerWidth * 0.05}px`; // 5% desde el borde izquierdo
  joypadBase.style.width = `${window.innerWidth * 0.2}px`; // 20% del ancho de la pantalla
  joypadBase.style.height = joypadBase.style.width; // Mantener proporción cuadrada
  joypadBase.style.border = "2px solid white";
  joypadBase.style.borderRadius = "50%";
  joypadBase.style.background = "rgba(255, 255, 255, 0.2)";
  joypadBase.style.touchAction = "none"; // Desactivar desplazamiento táctil predeterminado
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = `${parseFloat(joypadBase.style.width) * 0.4}px`; // 40% del tamaño del joypad base
  joypadStick.style.height = joypadStick.style.width; // Mantener proporción cuadrada
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = `translate(${parseFloat(joypadBase.style.width) * 0.3}px, ${parseFloat(joypadBase.style.width) * 0.3}px)`; // Centrar stick
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  // Manejar eventos táctiles
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

    // Limitar el movimiento del stick al área del joypad
    const radius = parseFloat(joypadBase.style.width) / 2;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), radius);
    const angle = Math.atan2(deltaY, deltaX);
    const stickX = Math.cos(angle) * distance;
    const stickY = Math.sin(angle) * distance;

    joypadStick.style.transform = `translate(${stickX + radius}px, ${stickY + radius}px)`;

    // Actualizar la posición del cubo según el movimiento del joypad
    cube.position.x += stickX * 0.01; // Ajustar sensibilidad según el tamaño del stick
    cube.position.z += stickY * 0.01;
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
    joypadStick.style.transform = `translate(${parseFloat(joypadBase.style.width) * 0.3}px, ${parseFloat(joypadBase.style.width) * 0.3}px)`; // Resetear posición del stick
  });

  // Redimensionar joypad si cambia el tamaño de la pantalla
  window.addEventListener("resize", () => {
    joypadBase.style.bottom = `${window.innerHeight * 0.1}px`;
    joypadBase.style.left = `${window.innerWidth * 0.05}px`;
    joypadBase.style.width = `${window.innerWidth * 0.2}px`;
    joypadBase.style.height = joypadBase.style.width;
    joypadStick.style.width = `${parseFloat(joypadBase.style.width) * 0.4}px`;
    joypadStick.style.height = joypadStick.style.width;
    joypadStick.style.transform = `translate(${parseFloat(joypadBase.style.width) * 0.3}px, ${parseFloat(joypadBase.style.width) * 0.3}px)`;
  });
}

// Llamar a createJoypad después de cargar la escena
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
    Fuerza: ${(stats.strength * 100).toFixed(0)}<br>
    Destreza: ${(stats.dexterity * 100).toFixed(0)}<br>
    Inteligencia: ${(stats.intelligence * 100).toFixed(0)}
  `;
  document.body.appendChild(statsDiv);

  // Iniciar animación
  animate();
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
