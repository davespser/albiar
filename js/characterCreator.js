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

// Crear el contenedor del cuestionario
function createContainer() {
  const container = document.createElement("div");
  container.id = "questionnaire";
  container.style.width = "300px";
  container.style.position = "absolute";
  container.style.top = "1%";
  container.style.right = "20px";
  container.style.fontSize = "15px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  container.style.alignItems = "flex-start";
  container.style.color = "white";
  container.style.padding = "20px";
  container.style.borderRadius = "15px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.textAlign = "left";
  document.body.appendChild(container);
  return container;
}

// Renderizar preguntas
function renderQuestions(container) {
  container.innerHTML = "<h1>Creación de Personaje</h1>";
  questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
      <label>${question}</label>
      <input type="number" id="question-${index}" step="1" min="1" max="5" required>
    `;
    container.appendChild(questionDiv);
  });

  const submitButton = document.createElement("button");
  submitButton.innerText = "Finalizar";
  submitButton.style.padding = "10px 20px";
  submitButton.style.marginTop = "20px";
  submitButton.style.backgroundColor = "#4CAF50";
  submitButton.style.color = "white";
  submitButton.style.border = "none";
  submitButton.style.cursor = "pointer";
  submitButton.addEventListener("click", handleSubmit);
  container.appendChild(submitButton);
}

// Calcular estadísticas del personaje
function calculateCharacterData(r, g, b) {
  const total = r + g + b;
  return {
    attack: (r / 255) * 100,
    speed: ((r + g) / 510) * 100,
    magic: (b / 255) * 100,
    defense: ((r * 0.6 + g * 0.4) / 255) * 100,
    precision: ((g + b) / 510) * 100,
    vitality: (total / 765) * 100,
  };
}

// Manejar envío de respuestas
async function handleSubmit() {
  const answers = questions.map((_, index) => {
    const value = parseInt(document.getElementById(`question-${index}`).value, 10) || 1;
    return Math.min(Math.max(value, 1), 5);
  });

  const red = Math.min(255, answers.slice(0, 7).reduce((acc, val) => acc + val * 10, 0));
  const green = Math.min(255, answers.slice(7, 14).reduce((acc, val) => acc + val * 10, 0));
  const blue = Math.min(255, answers.slice(14).reduce((acc, val) => acc + val * 10, 0));

  const colorHex = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  const derivedStats = calculateCharacterData(red, green, blue);

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = ref(database, `players/${user.uid}`);
      await update(userRef, {
        characterCreated: true,
        stats: { red, green, blue },
        color: colorHex,
        derivedStats
      });

      document.getElementById("questionnaire").remove();
      loadThreeScene({ x: 0, y: 0, z: 0, color: colorHex, stats: derivedStats });
    } else {
      alert("No se encontró un usuario autenticado.");
    }
  });
}

// Inicializar el creador de personajes
export function loadCharacterCreator() {
  const container = createContainer();
  renderQuestions(container);
}
