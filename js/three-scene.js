import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TerrainMesh } from "../js/terrain2/TerrainMesh.js";
import { createMenu, createJoypad, createStats } from "./ui.js"; // Importar funciones de interfaz
import { createFloor } from "./ground.js"; // Importar la función para crear el suelo

let scene, camera, renderer, cube, floor, robot, light, mixer;
let speed = 0.02; // Velocidad inicial
let cameraOffset = new THREE.Vector3(0, 5, 10); // Offset de la cámara detrás del cubo
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

  // Crear suelo usando `createFloor` desde ground.js
  createTerrainMesh(vertices, indices) {
    return TerrainMesh.create(vertices, indices);
  }

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

  // Crear menú y joypad desde ui.js
  createJoypad((stickX, stickY) => {
    if (cube) {
      cube.position.x += stickX * 0.1; // Ajusta la sensibilidad del movimiento
      cube.position.z += stickY * 0.1;
    }
  });

  // Crear estadísticas
  createStats(stats);

  // Crear menú
  createMenu();

  animate();
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

  const delta = clock.getDelta(); // Tiempo transcurrido desde el último frame

  // Actualizar el mixer (animaciones)
  if (mixer) mixer.update(delta);

  // Actualizar posición del robot (si es necesario)
  if (robot) {
    robot.position.z -= speed / 2;
    robot.rotation.y = Math.PI; // Ajustar orientación
  }

  // Actualizar la posición de la cámara para seguir al cubo
  if (cube) {
    const desiredPosition = new THREE.Vector3().addVectors(cube.position, cameraOffset);
    camera.position.lerp(desiredPosition, 0.1); // Suavizar movimiento de la cámara
    camera.lookAt(cube.position); // La cámara siempre mira al cubo
  }

  // Actualizar posición de la luz para que siga al cubo
  light.position.copy(cube.position).add(new THREE.Vector3(0, 2, 0));

  // Renderizar la escena
  renderer.render(scene, camera);
}

export function unloadThreeScene() {
  if (renderer) {
    renderer.dispose();
    document.body.innerHTML = ""; // Limpiar la interfaz
  }
}
