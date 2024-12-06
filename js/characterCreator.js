// Archivo: characterCreator.js

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { database } from "./firebase-config.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { loadThreeScene } from "./three-scene.js";

// Preguntas del cuestionario
const questions = [
  "¿Qué tan fuerte te consideras? (0-1)",
  "¿Qué tan ágil eres? (0-1)",
  "¿Qué tan inteligente te consideras? (0-1)"
];

// Elementos del DOM
const container = document.createElement("div");
container.id = "questionnaire";
container.style.position = "absolute";
container.style.top = "50%";
container.style.left = "50%";
container.style.transform = "translate(-50%, -50%)";
container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
container.style.color = "white";
container.style.padding = "20px";
container.style.borderRadius = "10px";
container.style.fontFamily = "Arial, sans-serif";
container.style.textAlign = "center";
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
      <input type="number" id="question-${index}" step="0.01" min="0" max="1" required>
    `;
    container.appendChild(questionDiv);
  });
  container.appendChild(submitButton);
}

submitButton.addEventListener("click", async () => {
  responses = questions.map((_, index) => {
    const value = parseFloat(document.getElementById(`question-${index}`).value) || 0;
    return Math.min(Math.max(value, 0), 1); // Asegurarse de que esté entre 0 y 1
  });

  const [strength, dexterity, intelligence] = responses;

  // Calcular color base
  const r = Math.round(strength * 255);
  const g = Math.round(dexterity * 255);
  const b = Math.round(intelligence * 255);
  const color = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  // Derivar estadísticas secundarias
  const stats = {
    ATK: (r / 255) * 100,
    SPD: ((r + g) / 510) * 100,
    MAG: (b / 255) * 100,
    DEF: ((r * 0.6 + g * 0.4) / 255) * 100,
    ACC: ((g + b) / 510) * 100,
    VIT: ((r + g + b) / 765) * 100
  };

  // Obtener usuario actual
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = ref(database, `players/${user.uid}`);

      // Guardar datos en Firebase
      await update(userRef, {
        characterCreated: true,
        stats: { strength, dexterity, intelligence },
        color,
        derivedStats: stats
      });

      // Cargar escena principal
      container.remove();
      loadThreeScene({ x: 0, y: 0, z: 0, color, stats });
    } else {
      alert("No se encontró un usuario autenticado.");
    }
  });
});

// Renderizar el cuestionario al cargar la página
renderQuestions();
