// Archivo: characterCreator.js

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { database } from "./firebase-config.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { loadThreeScene } from "./three-scene.js";

// Preguntas del cuestionario (7 para cada color)
const questions = [
  "¿Qué tan fuerte eres? (1-5)",
  "¿Qué tan decidido eres frente a desafíos? (1-5)",
  "¿Cómo evaluarías tu resistencia física? (1-5)",
  "¿Qué tan valiente te sientes en situaciones de riesgo? (1-5)",
  "¿Qué tan rápido te recuperas de un esfuerzo físico? (1-5)",
  "¿Qué tan constante eres al trabajar en tus metas? (1-5)",
  "¿Qué tan hábil eres en tareas que requieren fuerza? (1-5)",

  "¿Qué tan rápido eres en tus movimientos? (1-5)",
  "¿Qué tan coordinado te consideras? (1-5)",
  "¿Qué tan ágil eres en actividades físicas? (1-5)",
  "¿Qué tan preciso eres al realizar tareas? (1-5)",
  "¿Qué tan equilibrado te sientes físicamente? (1-5)",
  "¿Qué tan reactivo eres ante estímulos? (1-5)",
  "¿Qué tan eficiente eres corriendo? (1-5)",

  "¿Qué tan lógico eres al resolver problemas? (1-5)",
  "¿Qué tan creativo eres en tus ideas? (1-5)",
  "¿Qué tan hábil eres para planificar estrategias? (1-5)",
  "¿Qué tan bien comprendes conceptos abstractos? (1-5)",
  "¿Qué tan curioso eres al aprender cosas nuevas? (1-5)",
  "¿Qué tan imaginativo eres en tu forma de pensar? (1-5)",
  "¿Qué tan analítico eres en situaciones complejas? (1-5)"
];

// Elementos del DOM
const container = document.createElement("div");
container.id = "questionnaire";
container.style.width = "50px";
container.style.position = "absolute";
container.style.top = "1%";
container.style.right = "20px"; // Cambia 'left' a 'right' para posicionarlo a la derecha
container.style.fontSize = "15px"; // Corrección de error tipográfico
container.style.display = "flex";
container.style.flexDirection = "column"; // Organiza los elementos verticalmente
container.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
container.style.alignItems = "flex-start"; // Alinea el texto a la izquierda
container.style.color = "white"; // Corrección de minuscula
container.style.padding = "20px";
container.style.borderRadius = "15px";
container.style.fontFamily = "Arial, sans-serif";
container.style.textAlign = "left";
document.body.appendChild(container);

const submitButton = document.createElement("button");
submitButton.innerText = "Finalizar";
submitButton.style.padding = "10px 20px";
submitButton.style.marginTop = "20px";
submitButton.style.backgroundColor = "#4CAF50";
submitButton.style.color = "white";
submitButton.style.border = "none";
submitButton.style.cursor = "pointer";

let responses = [];

function renderQuestions() {
  container.innerHTML = "<h1>Creación de Personaje</h1>";
  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
      <label>${question}</label>
      <input type="number" id="question-${index}" step="1" min="1" max="5" required>
    `;
    container.appendChild(questionDiv);
  });
  container.appendChild(submitButton);
}

function calculateCharacterData(r, g, b) {
  const total = r + g + b;
  return {
    attack: (r / 255) * 100,
    speed: ((r + g) / 510) * 100,
    magic: (b / 255) * 100,
    defense: ((r * 0.6 + g * 0.4) / 255) * 100,
    precision: ((g + b) / 510) * 100,
    vitality: (total / 765) * 100,
    agility: (g / 255) * 100,
    intelligence: (b / 255) * 100,
    endurance: (r / 255) * 50 + (g / 255) * 50,
    charisma: (b / 255) * 75,
    perception: (g / 255) * 75,
    creativity: (b / 255) * 100,
    leadership: (r / 255) * 100,
    stealth: (g / 255) * 100,
    resilience: ((r + g) / 510) * 100,
    bravery: (r / 255) * 100,
    focus: (b / 255) * 100,
    luck: ((g + b) / 510) * 50,
    energy: (total / 765) * 100,
    harmony: ((r + g + b) / (255 * 3)) * 100
  };
}

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const answers = questions.map((_, index) => {
    const value = parseInt(document.getElementById(`question-${index}`).value, 10) || 1;
    return Math.min(Math.max(value, 1), 5);
  });

  const red = Math.min(255, answers.slice(0, 7).reduce((acc, val) => acc + val * 10, 0));
  const green = Math.min(255, answers.slice(7, 14).reduce((acc, val) => acc + val * 10, 0));
  const blue = Math.min(255, answers.slice(14).reduce((acc, val) => acc + val * 10, 0));

  const colorHex = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  const derivedStats = calculateCharacterData(red, green, blue);

  // Obtener usuario actual
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = ref(database, `players/${user.uid}`);

      // Guardar datos en Firebase
      await update(userRef, {
        characterCreated: true,
        stats: { red, green, blue },
        color: colorHex,
        derivedStats
      });

      // Cargar escena principal
      container.remove();
      loadThreeScene({ x: 0, y: 0, z: 0, color: colorHex, stats: derivedStats });
    } else {
      alert("No se encontró un usuario autenticado.");
    }
  });
});

// Renderizar el cuestionario al cargar la página
renderQuestions();

export function loadCharacterCreator(userId) {
  console.log("Cargando creador de personaje para usuario:", userId);
  renderQuestions();
}
