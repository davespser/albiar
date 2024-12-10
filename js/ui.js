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
export function createJoypad(onMoveCallback) {
  const joypadBase = document.createElement("div");
  joypadBase.style.position = "absolute";
  joypadBase.style.bottom = "10%";
  joypadBase.style.left = "5%";
  joypadBase.style.width = "150px";
  joypadBase.style.height = "150px";
  joypadBase.style.border = "2px solid white";
  joypadBase.style.borderRadius = "50%";
  joypadBase.style.background = "rgba(255, 255, 255, 0.2)";
  joypadBase.style.touchAction = "none";
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = "60px";
  joypadStick.style.height = "60px";
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = "translate(45px, 45px)"; // Centrar en el joypad
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let centerX = 75; // Centro del joypad
  let centerY = 75;

  joypadBase.addEventListener("touchstart", (event) => {
    isDragging = true;
    const touch = event.touches[0];
    centerX = touch.clientX;
    centerY = touch.clientY;
  });

  joypadBase.addEventListener("touchmove", (event) => {
    if (!isDragging) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), 75);
    const angle = Math.atan2(deltaY, deltaX);
    const stickX = Math.cos(angle) * distance / 75; // Normalizado entre -1 y 1
    const stickY = Math.sin(angle) * distance / 75;

    joypadStick.style.transform = `translate(${stickX * 75 + 45}px, ${stickY * 75 + 45}px)`;

    if (onMoveCallback) onMoveCallback(stickX, -stickY); // Invertir eje Y para correspondencia lógica
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
    joypadStick.style.transform = "translate(45px, 45px)"; // Resetear a posición inicial
    if (onMoveCallback) onMoveCallback(0, 0); // Detener movimiento
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
