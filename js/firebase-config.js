import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDhzxutPaa1OxXDe2d4T5pNxGkNsrdlifs",
  authDomain: "database-02549z.firebaseapp.com",
  databaseURL: "https://database-02549z-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "database-02549z",
  storageBucket: "database-02549z.appspot.com",
  messagingSenderId: "970508003334",
  appId: "1:970508003334:web:bf44e95b6c34b369d7bb87",
  measurementId: "G-VW9QXZQ6CW",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app); // Inicializar la base de datos

// Exportar servicios
export { auth, database };
