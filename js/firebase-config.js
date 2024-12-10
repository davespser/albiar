import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID",
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
