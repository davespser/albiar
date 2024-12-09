import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer, cube, floor, robot, light, mixer;
let speed = 0.02; // Velocidad inicial
const clock = new THREE.Clock();

// Función para cargar la escena principal
export function loadThreeScene({ x = 0, y = 0, z = 0, color = 0xff4500, stats = {} }) {
  // Crear escena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Configurar cámara
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(x + 10, y + 5, z + 10);
  camera.lookAt(x, y, z);

  // Configurar renderizador
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.innerHTML = ""; // Limpiar la interfaz anterior
  document.body.appendChild(renderer.domElement);

  // Agregar luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  light = new THREE.PointLight(0xffffff, 1, 100);
  scene.add(light);

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

  // Crear cubo con specularMap
  const textureLoader = new THREE.TextureLoader();
  const specularMap = textureLoader.load("./js/Specularbox.png");

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({
    color,
    specular: 0xffffff,
    shininess: 100,
    specularMap,
  });

  cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y + 0.5, z);
  cube.castShadow = true;
  scene.add(cube);

  // Cargar modelo GLTF
  const loader = new GLTFLoader();
  loader.load(
    "./models/npc/robotauro_walk.glb",
    (gltf) => {
      robot = gltf.scene;
      robot.position.set(x, y + 2.5, z);
      robot.scale.set(0.05, 0.05, 0.05);
      robot.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
      scene.add(robot);

      // Configurar animaciones
      mixer = new THREE.AnimationMixer(robot);
      if (gltf.animations.length > 0) {
        const walkAction = mixer.clipAction(gltf.animations[0]);
        walkAction.play();
      }
    },
    undefined,
    (error) => {
      console.error("Error al cargar el modelo: ", error);
    }
  );

  // Configurar eventos de teclado para mover el cubo
  window.addEventListener("keydown", handleKeyDown);

  // Crear menú y joypad
  createMenu();
  createJoypad();

  // Iniciar animación
  animate();
}

// Crear menú superpuesto
function createMenu() {
  const menuContainer = document.createElement("div");
  menuContainer.classList.add("menu-container");
  menuContainer.innerHTML = `
    <input type="checkbox" id="toggle" class="hidden-input">
    <label for="toggle" class="menu-item"><span>🔸</span> Menú</label>
    <div class="menu-content">
      <div class="menu-item" data-action="option1"><span>🔸</span> Opción 1</div>
      <div class="menu-item" data-action="option2"><span>🔸</span> Opción 2</div>
      <div class="menu-item" data-action="option3"><span>🔸</span> Opción 3</div>
      <div class="menu-item" data-action="option4"><span>🔸</span> Opción 4</div>
    </div>`;
  document.body.appendChild(menuContainer);
}

// Crear joypad
function createJoypad() {
  const joypadBase = document.createElement("div");
  joypadBase.style.position = "absolute";
  joypadBase.style.bottom = "10%";
  joypadBase.style.left = "5%";
  joypadBase.style.width = "100px";
  joypadBase.style.height = "100px";
  joypadBase.style.border = "2px solid white";
  joypadBase.style.borderRadius = "50%";
  joypadBase.style.background = "rgba(255, 255, 255, 0.2)";
  joypadBase.style.touchAction = "none";
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = "40px";
  joypadStick.style.height = "40px";
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = "translate(30%, 30%)";
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  const maxRadius = 50;

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

    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxRadius);
    const angle = Math.atan2(deltaY, deltaX);
    const stickX = Math.cos(angle) * distance;
    const stickY = Math.sin(angle) * distance;

    joypadStick.style.transform = `translate(calc(50% + ${stickX}px - 20px), calc(50% + ${stickY}px - 20px))`;

    if (cube) {
      cube.position.x += (stickX / maxRadius) * speed;
      cube.position.z += (stickY / maxRadius) * speed;
    }
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
    joypadStick.style.transform = "translate(30%, 30%)";
  });
}

// Manejar teclas
function handleKeyDown(event) {
  if (!cube) return;

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

// Animar la escena
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  if (robot) {
    robot.position.z -= speed / 2; // Simula caminar hacia adelante
    robot.rotation.y = Math.PI; // Ajusta orientación
  }

  if (cube) {
    light.position.copy(cube.position).add(new THREE.Vector3(0, 2, 0));
  }

  renderer.render(scene, camera);
}

// Descargar la escena
export function unloadThreeScene() {
  if (renderer) {
    renderer.dispose();
    document.body.innerHTML = ""; // Limpiar la interfaz
  }
}
