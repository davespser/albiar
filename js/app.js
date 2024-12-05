// Importar Firebase y módulos necesarios
import { auth, database } from "./firebase-config.js";
import { ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
 Importar Firebase Authentication
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Importar Three.js
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";

const auth = getAuth();

// Función para registrar un nuevo usuario
function registerUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario registrado:", user.uid);
     loadPlayerData(user.uid)
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error.message);
    });
}

// Función para iniciar sesión
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario logueado:", user);
      loadPlayerData(user.uid); // Cargar datos del jugador al iniciar sesión
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
    });
}
// Generar un Player ID único
const playerId = auth.currentUser.uid; // ID único del usuario logueado
const playerData = {
  name: "Mi Cubo",
  level: 1,
  position: { x: 0, y: 0, z: 0 }
};

savePlayerData(playerId, playerData); // Guardar datos asociados al usuario
loadPlayerData(playerId); // Cargar datos del usuario

// Configuración inicial de datos del jugador
const playerData = {
  position: { x: 0, y: 0, z: 5 },
  rotation: { x: 0, y: 0 },
};

// Guardar los datos iniciales en Firebase
const playerRef = ref(database, `players/${playerID}`);
set(playerRef, playerData);

// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("threeCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);

// Crear el cubo (Player)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const playerCube = new THREE.Mesh(geometry, material);
scene.add(playerCube);

camera.position.z = 10;

// Actualizar la posición inicial del cubo
playerCube.position.set(playerData.position.x, playerData.position.y, playerData.position.z);

// Función para cargar los datos del jugador
function loadPlayer() {
  onValue(playerRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      playerCube.position.set(data.position.x, data.position.y, data.position.z);
      playerCube.rotation.x = data.rotation.x;
      playerCube.rotation.y = data.rotation.y;
    }
  });
}

// Llamar a loadPlayer para escuchar cambios en tiempo real
loadPlayer();

// Movimiento del jugador con las teclas de flecha
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      playerCube.position.z -= 0.1;
      break;
    case "ArrowDown":
      playerCube.position.z += 0.1;
      break;
    case "ArrowLeft":
      playerCube.position.x -= 0.1;
      break;
    case "ArrowRight":
      playerCube.position.x += 0.1;
      break;
  }

  // Actualizar los datos en Firebase
  set(playerRef, {
    position: {
      x: playerCube.position.x,
      y: playerCube.position.y,
      z: playerCube.position.z,
    },
    rotation: {
      x: playerCube.rotation.x,
      y: playerCube.rotation.y,
    },
  });
});

// Animación del cubo
function animate() {
  requestAnimationFrame(animate);

  // Renderizar la escena
  renderer.render(scene, camera);
}
animate();

// Ajustar el canvas al cambiar el tamaño de la ventana
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
