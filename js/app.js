// Importar Firebase y módulos necesarios
import { auth, database } from "./firebase-config.js";
import { ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Importar Three.js
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";



// Función para registrar un nuevo usuario
function registerUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario registrado:", user.uid);

      // Guardar datos iniciales del usuario en la base de datos
      const initialData = {
        name: email,
        level: 1,
        position: { x: 0, y: 0, z: 0 }
      };
      set(ref(database, 'players/' + user.uid), initialData);
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error.message);
    });
}

// Función para iniciar sesión con un usuario existente
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario logueado:", user.uid);

      // Cargar datos del jugador al iniciar sesión
      loadPlayerData(user.uid);
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
    });
}

// Cargar datos del jugador desde la base de datos
function loadPlayerData(userId) {
  get(ref(database, 'players/' + userId))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Datos del jugador cargados:", data);
        // Aquí podrías usar los datos para mover o mostrar el cubo en Three.js
      } else {
        console.log("No se encontraron datos para este usuario.");
      }
    })
    .catch((error) => {
      console.error("Error al cargar datos:", error);
    });
}
// Manejar el registro
function handleRegister() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  registerUser(email, password);
}

// Manejar el inicio de sesión
function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  loginUser(email, password);
}
// Escuchar cambios en tiempo real (opcional)
function listenForPlayerUpdates(userId) {
  const playerRef = ref(database, 'players/' + userId);
  onValue(playerRef, (snapshot) => {
    const updatedData = snapshot.val();
    console.log("Datos actualizados:", updatedData);
    // Actualiza el cubo en Three.js aquí si es necesario
  });
}

// Verificar si el usuario está logueado (opcional)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario conectado:", user.uid);
    loadPlayerData(user.uid);
  } else {
    console.log("Usuario desconectado.");
  }
});
