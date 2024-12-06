// Importa las funciones necesarias
import { auth, database } from "/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { loadCharacterCreator } from "./characterCreator.js";
import { loadThreeScene } from "/three-scene.js";

// Registro de usuario
function handleRegister() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario registrado:", user);

      // Guardar datos iniciales del usuario en la base de datos
      const initialData = {
        level: 1,
        position: { x: 0, y: 0, z: 0 },
        characterCreated: false // Flag para verificar si completó el cuestionario
      };
      saveUserData(user.uid, initialData);
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error.message);
    });
}

// Inicio de sesión
function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Usuario inició sesión:", userCredential.user);

      // Lógica para cargar la pantalla correcta
      const userRef = ref(database, `players/${userCredential.user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().characterCreated) {
          // Si el cuestionario ya fue completado, cargar el juego
          showScreen("game-screen");
          loadThreeScene({
            ...snapshot.val().position,
            color: snapshot.val().color,
            stats: snapshot.val().derivedStats
          });
        } else {
          // Si no se completó, cargar el cuestionario
          showScreen("questionnaire-screen");
          loadCharacterCreator(userCredential.user.uid);
        }
      });
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
    });
}

// Escuchar el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    handleLogin();
  } else {
    showScreen("login-screen");
  }
});

// Mostrar pantallas
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

// Exportar funciones al ámbito global
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
