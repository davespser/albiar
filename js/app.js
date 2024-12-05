import { auth, database } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { ref, get, set } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { loadThreeScene, unloadThreeScene } from "./three-scene.js"; // Asegúrate de crear el archivo three-scene.js

// Función para registrar un usuario nuevo
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
      alert("Usuario registrado con éxito.");
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error.message);
      alert("Error al registrar usuario: " + error.message);
    });
}

// Función para iniciar sesión
function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Inicio de sesión exitoso:", user.uid);
      alert("Inicio de sesión exitoso.");
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
      alert("Error al iniciar sesión: " + error.message);
    });
}
function saveUserData(userId, data) {
  set(ref(database, `players/${userId}`), data)
    .then(() => {
      console.log("Datos del usuario guardados correctamente.");
    })
    .catch((error) => {
      console.error("Error al guardar los datos del usuario:", error.message);
    });
}

// Llamar esta función después del registro:
registerUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const initialData = {
        level: 1,
        position: { x: 0, y: 0, z: 0 }
      };
      saveUserData(user.uid, initialData);
    })
    .catch((error) => {
      console.error(error.message);
    });
}
// Función para cerrar sesión
function logoutUser() {
  signOut(auth)
    .then(() => {
      console.log("Usuario desconectado.");
      unloadThreeScene();
      alert("Sesión cerrada.");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error.message);
      alert("Error al cerrar sesión: " + error.message);
    });
}

// Función para cargar datos del jugador desde la base de datos

function loadUserData(userId) {
  get(ref(database, `players/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("Datos del usuario cargados:", userData);

        // Inicializa la escena de Three.js con los datos cargados
        loadThreeScene(userData.position);
      } else {
        console.log("No se encontraron datos para este usuario.");
      }
    })
    .catch((error) => {
      console.error("Error al cargar los datos del usuario:", error.message);
    });
}
function updateUserPosition(userId, newPosition) {
  set(ref(database, `players/${userId}/position`), newPosition)
    .then(() => {
      console.log("Posición actualizada en la base de datos.");
    })
    .catch((error) => {
      console.error("Error al actualizar la posición:", error.message);
    });
}

// Llamar esta función cuando cambie la posición en Three.js:
function onCubeMove(newPosition) {
  const user = auth.currentUser;
  if (user) {
    updateUserPosition(user.uid, newPosition);
  }
}
// Llamar esta función al iniciar sesión:
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserData(user.uid);
  }
});

// Detectar el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario conectado:", user.uid);
    loadPlayerData(user.uid); // Cargar datos y escena si el usuario está autenticado
  } else {
    console.log("Usuario no conectado.");
    unloadThreeScene(); // Asegurarse de que la escena se descargue si no hay usuario
  }
});

// Manejar registro e inicio de sesión desde los botones
window.handleRegister = () => {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  registerUser(email, password);
};

window.handleLogin = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  loginUser(email, password);
};

window.handleLogout = () => {
  logoutUser();
};
