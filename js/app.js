// Importa las funciones necesarias
import { auth, database } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import {
  ref,
  get,
  set
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { loadThreeScene, unloadThreeScene } from "./three-scene.js";
import { loadCharacterCreator } from "./characterCreator.js";

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
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
    });
}

// Cerrar sesión
function handleLogout() {
  signOut(auth)
    .then(() => {
      console.log("Usuario desconectado");
      unloadThreeScene(); // Desmontar la escena si el usuario cierra sesión
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error.message);
    });
}

// Guardar datos en la base de datos
function saveUserData(userId, data) {
  set(ref(database, `players/${userId}`), data)
    .then(() => {
      console.log("Datos del usuario guardados correctamente.");
    })
    .catch((error) => {
      console.error("Error al guardar los datos del usuario:", error.message);
    });
}

// Cargar datos del usuario desde la base de datos
function loadUserData(userId) {
  get(ref(database, `players/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("Datos del usuario cargados:", userData);

        // Validar datos obligatorios
        if (!userData.stats || !userData.color) {
          console.error("Faltan estadísticas o color en los datos del usuario.");
          return;
        }

        // Verificar si ya completó el cuestionario de creación de personaje
        if (!userData.characterCreated) {
          // Si no lo completó, cargar el creador de personajes
          loadCharacterCreator(userId);
        } else {
          // Si ya lo completó, cargar la escena principal
          loadThreeScene({
            ...userData.position,
            color: userData.color,
            stats: userData.stats
          });
        }
      } else {
        console.log("No se encontraron datos para este usuario.");
      }
    })
    .catch((error) => {
      console.error("Error al cargar los datos del usuario:", error.message);
    });
}

// Escuchar el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Sesión activa con usuario:", user);

    // Cargar datos del usuario e iniciar la escena o el creador de personajes
    loadUserData(user.uid);
  } else {
    console.log("No hay ningún usuario conectado.");
    unloadThreeScene(); // Desmontar la escena si no hay usuario
  }
});

// Exportar funciones para usarlas en el HTML
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
