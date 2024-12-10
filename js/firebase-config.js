// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDhzxutPaa1OxXDe2d4T5pNxGkNsrdlifs",
  authDomain: "database-02549z.firebaseapp.com",
  databaseURL: "https://database-02549z-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-02549z",
  storageBucket: "database-02549z.appspot.com",
  messagingSenderId: "970508003334",
  appId: "1:970508003334:web:bf44e95b6c34b369d7bb87",
  measurementId: "G-VW9QXZQ6CW"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

// Configura la persistencia de autenticación
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistencia de autenticación configurada correctamente.");
  })
  .catch((error) => {
    console.error("Error al configurar la persistencia de autenticación:", error.message);
  });
