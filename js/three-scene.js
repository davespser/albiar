export function loadCharacterCreator(userId) {
  const container = document.getElementById("questionnaire");
  container.innerHTML = ""; // Limpiar el contenedor antes de renderizar

  // Preguntas del cuestionario
  const questions = [
    // Tus 21 preguntas
  ];

  // Renderizar preguntas
  questions.forEach((question, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${question}</label>
      <input type="number" id="question-${index}" min="1" max="5" required />
    `;
    container.appendChild(div);
  });

  // Botón para finalizar
  const button = document.createElement("button");
  button.innerText = "Finalizar";
  button.onclick = async () => {
    // Procesar respuestas
    const answers = questions.map((_, index) => {
      return parseInt(document.getElementById(`question-${index}`).value, 10) || 1;
    });

    // Calcular estadísticas y guardar en Firebase
    const red = Math.min(255, answers.slice(0, 7).reduce((acc, val) => acc + val * 10, 0));
    const green = Math.min(255, answers.slice(7, 14).reduce((acc, val) => acc + val * 10, 0));
    const blue = Math.min(255, answers.slice(14).reduce((acc, val) => acc + val * 10, 0));
    const color = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
    const derivedStats = calculateCharacterData(red, green, blue);

    await update(ref(database, `players/${userId}`), {
      characterCreated: true,
      stats: { red, green, blue },
      color,
      derivedStats
    });

    // Cargar el juego
    showScreen("game-screen");
    loadThreeScene({ x: 0, y: 0, z: 0, color, stats: derivedStats });
  };
  container.appendChild(button);
}
