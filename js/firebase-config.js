
// Configuración de Firebase
const firebaseConfig = {
   apiKey: "AIzaSyDhzxutPaa1OxXDe2d4T5pNxGkNsrdlifs",
    authDomain: "database-02549z.firebaseapp.com",
    databaseURL: "https://database-02549z-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "database-02549z",
    storageBucket: "database-02549z.firebasestorage.app",
    messagingSenderId: "970508003334",
    appId: "1:970508003334:web:bf44e95b6c34b369d7bb87",
    measurementId: "G-VW9QXZQ6CW"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
