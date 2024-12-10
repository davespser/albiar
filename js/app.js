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

      // Cargar el creador de personajes después de registro
      loadCharacterCreator(user.uid);
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

        // Verificar si ya completó el cuestionario de creación de personaje
        if (!userData.characterCreated) {
          console.log("Cargando creador de personaje...");
          loadCharacterCreator(userId);
        } else {
          console.log("Cargando escena principal...");
          loadThreeScene({
            ...userData.position,
            color: userData.color,
            stats: userData.derivedStats // Usar las estadísticas calculadas previamente
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
onAuthStateChanged(auth, (user) => {
  const appContainer = document.getElementById("app-container");

  if (user) {
    console.log("Sesión activa con usuario:", user);

    // Limpiar contenido previo y cargar datos del usuario
    appContainer.innerHTML = "";
    loadUserData(user.uid);
  } else {
    console.log("No hay ningún usuario conectado.");

    // Mostrar mensaje de inicio de sesión
    appContainer.innerHTML = "<h1>Inicie sesión o regístrese</h1>";
    unloadThreeScene();
  }
});
// Escuchar el estado de autenticación


// Exportar funciones para usarlas en el HTML
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
