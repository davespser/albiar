// app.js

// Crear escena de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear un cubo para representar al jugador
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(geometry, material);
scene.add(player);

// Posicionar la cámara
camera.position.z = 5;

// Función de animación
function animate() {
  requestAnimationFrame(animate);

  // Movimiento del jugador (rotación)
  player.rotation.x += 0.01;
  player.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// Guardar el estado del jugador en Firebase
function savePlayerPosition(position) {
  const playerRef = database.ref('playerPosition');
  playerRef.set({
    x: position.x,
    y: position.y,
    z: position.z
  });
}

// Cargar la posición del jugador desde Firebase
function loadPlayerPosition() {
  const playerRef = database.ref('playerPosition');
  playerRef.once('value', (snapshot) => {
    const position = snapshot.val();
    if (position) {
      player.position.set(position.x, position.y, position.z);
    }
  });
}

// Cargar la posición del jugador cuando inicie el juego
loadPlayerPosition();

// Movimiento básico (con teclas de flecha)
document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    player.position.z -= 0.1;
  } else if (event.key === 'ArrowDown') {
    player.position.z += 0.1;
  }
  savePlayerPosition(player.position);
});
