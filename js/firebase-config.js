import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.handleRegister = async () => {
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        document.getElementById("messages").innerText = `Registro exitoso: ${userCredential.user.email}`;
    } catch (error) {
        document.getElementById("messages").innerText = `Error: ${error.message}`;
    }
};

window.handleLogin = async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        document.getElementById("messages").innerText = `Bienvenido: ${userCredential.user.email}`;
    } catch (error) {
        document.getElementById("messages").innerText = `Error: ${error.message}`;
    }
};

window.handleLogout = async () => {
    try {
        await signOut(auth);
        document.getElementById("messages").innerText = "Sesión cerrada";
    } catch (error) {
        document.getElementById("messages").innerText = `Error: ${error.message}`;
    }
};
