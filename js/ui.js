// ui.js

// Función para crear el menú
export function createMenu() {
  const menuContainer = document.createElement("div");
  menuContainer.classList.add("menu-container");
  menuContainer.innerHTML = `
    <input type="checkbox" id="toggle" class="hidden-input">
    <label for="toggle" class="menu-item"><span>🔸</span> Menú</label>
    <div class="menu-content">
      <div class="menu-item" data-action="option1"><span>🔸</span> Opción 1</div>
      <div class="menu-item" data-action="option2"><span>🔸</span> Opción 2</div>
      <div class="menu-item" data-action="option3"><span>🔸</span> Opción 3</div>
      <div class="menu-item" data-action="option4"><span>🔸</span> Opción 4</div>
    </div>`;
  document.body.appendChild(menuContainer);
}

// Función para crear el joypad
export function createJoypad(cube, speed) {
  const joypadBase = document.createElement("div");
  joypadBase.style.position = "absolute";
  joypadBase.style.bottom = "10%";
  joypadBase.style.left = "5%";
  joypadBase.style.width = "100px";
  joypadBase.style.height = "100px";
  joypadBase.style.border = "2px solid white";
  joypadBase.style.borderRadius = "50%";
  joypadBase.style.background = "rgba(255, 255, 255, 0.2)";
  joypadBase.style.touchAction = "none";
  document.body.appendChild(joypadBase);

  const joypadStick = document.createElement("div");
  joypadStick.style.position = "absolute";
  joypadStick.style.width = "40px";
  joypadStick.style.height = "40px";
  joypadStick.style.background = "white";
  joypadStick.style.borderRadius = "50%";
  joypadStick.style.transform = "translate(30%, 30%)";
  joypadBase.appendChild(joypadStick);

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  const maxRadius = 50;

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

    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxRadius);
    const angle = Math.atan2(deltaY, deltaX);
    const stickX = Math.cos(angle) * distance;
    const stickY = Math.sin(angle) * distance;

    joypadStick.style.transform = `translate(calc(50% + ${stickX}px - 20px), calc(50% + ${stickY}px - 20px))`;

    // Actualizar posición del cubo en función del joystick
    if (cube) {
      cube.position.x += (stickX / maxRadius) * speed;
      cube.position.z += (stickY / maxRadius) * speed;
    }
  });

  joypadBase.addEventListener("touchend", () => {
    isDragging = false;
    joypadStick.style.transform = "translate(30%, 30%)";
  });
}
