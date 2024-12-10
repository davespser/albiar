// Archivo: menu.js

// Crear el menú
export function createMenu(options) {
  // Implementa aquí si necesitas un menú interactivo en pantalla
  // Ejemplo de placeholder:
  const menuDiv = document.createElement("div");
  menuDiv.style.position = "absolute";
  menuDiv.style.top = "10px";
  menuDiv.style.right = "10px";
  menuDiv.style.color = "white";
  menuDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  menuDiv.style.padding = "10px";
  menuDiv.style.borderRadius = "10px";
  menuDiv.style.fontFamily = "Arial, sans-serif";
  menuDiv.innerHTML = "<strong>Menú Placeholder</strong>";
  document.body.appendChild(menuDiv);
}

// Crear el joypad
export function createJoypad(onMove) {
  const joypadBase = document.createElement("div");
  joypadBase.style.position = "absolute";
  joypadBase.style.bottom = `${window.innerHeight * 0.1}px`;
  joypadBase.style.left = `${window.innerWidth * 0.05}px`;
  joypadBase.style.width = `${window.innerWidth * 0.2}px`;
  joypadBase.style.height = joypadBase.style.width;
  joypadBase.style.border = "2px solid white";
  joypadBase.style.borderRadius = "50%";
  joypadBase.style.background = "rgba(255, 255, 255, 0.2)";
  joypadBase.style.touchAction = "none";
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = `${parseFloat(joypadBase.style.width) * 0.4}px`;
  joypadStick.style.height = joypadStick.style.width;
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = `translate(${parseFloat(joypadBase.style.width) * 0.3}px, ${parseFloat(joypadBase.style.width) * 0.3}px)`;
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let startX = 0;
  let startY = 0;

  joypadBase.addEventListener("touchstart", (event) => {
    isDragging = true;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  joypadBase.addEventListener("touchmove", (event) => {
    if (!isDragging) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    const radius = parseFloat(joypadBase.style.width) / 2;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), radius);
    const angle = Math.atan2(deltaY, deltaX);

    const stickX = Math.cos(angle) * distance;
    const stickY = Math.sin(angle) * distance;
    joypadStick.style.transform = `translate(${stickX + radius}px, ${stickY + radius}px)`;

    // Llama a la función de callback
    onMove(stickX, stickY);
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
    joypadStick.style.transform = `translate(${parseFloat(joypadBase.style.width) * 0.3}px, ${parseFloat(joypadBase.style.width) * 0.3}px)`;
  });

  window.addEventListener("resize", () => {
    joypadBase.style.bottom = `${window.innerHeight * 0.1}px`;
    joypadBase.style.left = `${window.innerWidth * 0.05}px`;
    joypadBase.style.width = `${window.innerWidth * 0.2}px`;
    joypadBase.style.height = joypadBase.style.width;
    joypadStick.style.width = `${parseFloat(joypadBase.style.width) * 0.4}px`;
    joypadStick.style.height = joypadStick.style.width;
    joypadStick.style.transform = `translate(${parseFloat(joypadBase.style.width) * 0.3}px, ${parseFloat(joypadBase.style.width) * 0.3}px)`;
  });
}

// Crear estadísticas
export function createStats(stats) {
  const statsDiv = document.createElement("div");
  statsDiv.style.position = "absolute";
  statsDiv.style.top = "10px";
  statsDiv.style.left = "10px";
  statsDiv.style.color = "white";
  statsDiv.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  statsDiv.style.padding = "10px";
  statsDiv.style.borderRadius = "10px";
  statsDiv.style.fontFamily = "Arial, sans-serif";
  statsDiv.innerHTML = `
    <strong>Estadísticas del Personaje:</strong><br>
    Ataque: ${stats.attack?.toFixed(1) || 0}<br>
    Velocidad: ${stats.speed?.toFixed(1) || 0}<br>
    Magia: ${stats.magic?.toFixed(1) || 0}<br>
    Defensa: ${stats.defense?.toFixed(1) || 0}<br>
    Precisión: ${stats.precision?.toFixed(1) || 0}<br>
    Vitalidad: ${stats.vitality?.toFixed(1) || 0}<br>
  `;
  document.body.appendChild(statsDiv);
}
