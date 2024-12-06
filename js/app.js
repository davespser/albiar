import { auth, database } from "./js/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { loadCharacterCreator } from "./characterCreator.js";
import { loadThreeScene } from "./three-scene.js";

// Función para mostrar una pantalla específica
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

// Inicio de sesión
function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario inició sesión:", user);

      // Verificar si el cuestionario ya fue completado
      const userRef = ref(database, `players/${user.uid}`);
      get(userRef).then((snapshot) => {
        const userData = snapshot.val();
        if (userData && userData.characterCreated) {
          showScreen("game-screen");
          loadThreeScene({ ...userData.position, color: userData.color, stats: userData.derivedStats });
        } else {
          showScreen("questionnaire-screen");
          loadCharacterCreator(user.uid);
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
    console.log("Sesión activa con usuario:", user);
    handleLogin();
  } else {
    showScreen("login-screen");
  }
});

// Exportar función de login para el HTML
window.handleLogin = handleLogin;
