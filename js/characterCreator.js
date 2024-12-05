// Importar módulos y configuración
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { database } from "./firebaseConfig.js";

// Variables globales
let username = "";

// Inicializar Character Creator
function loadCharacterCreator(user) {
  username = user;

  // Crear contenedor del cuestionario
  const quizDiv = document.createElement("div");
  quizDiv.style.position = "absolute";
  quizDiv.style.top = "50%";
  quizDiv.style.left = "50%";
  quizDiv.style.transform = "translate(-50%, -50%)";
  quizDiv.style.padding = "20px";
  quizDiv.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  quizDiv.style.color = "white";
  quizDiv.style.borderRadius = "10px";
  quizDiv.style.fontFamily = "Arial, sans-serif";
  quizDiv.style.textAlign = "center";
  quizDiv.style.width = "80%";
  quizDiv.style.maxWidth = "600px";
  document.body.appendChild(quizDiv);

  // Crear título del cuestionario
  const title = document.createElement("h1");
  title.innerText = "¡Crea tu personaje!";
  quizDiv.appendChild(title);

  // Crear formulario del cuestionario
  const form = document.createElement("form");
  form.id = "characterForm";

  for (let i = 1; i <= 21; i++) {
    const questionDiv = document.createElement("div");
    questionDiv.style.marginBottom = "10px";

    const label = document.createElement("label");
    label.innerText = `Pregunta ${i}:`;
    label.style.display = "block";
    questionDiv.appendChild(label);

    const input = document.createElement("input");
    input.type = "text";
    input.name = `question${i}`;
    input.required = true;
    input.style.width = "100%";
    input.style.padding = "5px";
    questionDiv.appendChild(input);

    form.appendChild(questionDiv);
  }

  // Botón de enviar
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.innerText = "Terminar";
  submitButton.style.padding = "10px 20px";
  submitButton.style.marginTop = "20px";
  submitButton.style.backgroundColor = "#4CAF50";
  submitButton.style.color = "white";
  submitButton.style.border = "none";
  submitButton.style.cursor = "pointer";
  form.appendChild(submitButton);

  quizDiv.appendChild(form);

  // Manejar envío del formulario
  form.addEventListener("submit", handleQuizSubmission);
}

// Manejar envío del cuestionario
async function handleQuizSubmission(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const answers = {};

  for (let [key, value] of formData.entries()) {
    answers[key] = value;
  }

  // Guardar respuestas en Firebase
  const userRef = ref(database, `users/${username}/character`);
  await set(userRef, answers);

  // Eliminar el cuestionario de la vista
  const quizDiv = document.querySelector("div");
  document.body.removeChild(quizDiv);

  // Cargar escena Three.js
  import("./three-scene.js").then((module) => {
    module.loadThreeScene();
  });
}

export { loadCharacterCreator };
