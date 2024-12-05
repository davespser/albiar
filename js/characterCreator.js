// Importa las funciones necesarias
import { database } from "./firebase-config.js";
import {
  ref,
  update
} from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { loadThreeScene } from "./three-scene.js";

// Mostrar el cuestionario
export function loadCharacterCreator(userId) {
  // Crear la interfaz del cuestionario
  document.body.innerHTML = `
    <h1>Creación de Personaje</h1>
    <form id="character-form">
      ${generateQuestions()}
      <button type="submit">Finalizar</button>
    </form>
  `;

  // Manejar el envío del formulario
  document.getElementById("character-form").addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener las respuestas del cuestionario
    const formData = new FormData(event.target);
    const answers = Array.from(formData.values()).map(Number);

    // Calcular las estadísticas base (Fuerza, Destreza, Inteligencia)
    const { strength, dexterity, intelligence } = calculateBaseStats(answers);

    // Calcular el color del personaje
    const color = calculateColor(strength, dexterity, intelligence);

    // Guardar los datos del personaje en la base de datos
    update(ref(database, `players/${userId}`), {
      characterCreated: true,
      stats: { strength, dexterity, intelligence },
      color
    })
      .then(() => {
        console.log("Personaje creado con éxito.");
        // Cargar la escena principal
        loadThreeScene({ x: 0, y: 0, z: 0 });
      })
      .catch((error) => {
        console.error("Error al guardar el personaje:", error.message);
      });
  });
}

// Generar las preguntas del cuestionario
function generateQuestions() {
  let questions = "";
  for (let i = 1; i <= 21; i++) {
    questions += `
      <label for="question-${i}">Pregunta ${i}:</label>
      <input type="number" id="question-${i}" name="question-${i}" min="1" max="5" required>
      <br>
    `;
  }
  return questions;
}

// Calcular estadísticas base
function calculateBaseStats(answers) {
  const total = answers.reduce((sum, value) => sum + value, 0);
  const strength = answers.slice(0, 7).reduce((sum, value) => sum + value, 0) / total;
  const dexterity = answers.slice(7, 14).reduce((sum, value) => sum + value, 0) / total;
  const intelligence = answers.slice(14).reduce((sum, value) => sum + value, 0) / total;

  return { strength, dexterity, intelligence };
}

// Calcular el color del personaje
function calculateColor(strength, dexterity, intelligence) {
  const r = Math.round(strength * 255);
  const g = Math.round(dexterity * 255);
  const b = Math.round(intelligence * 255);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
