// ui.js

let menuContainer, joypadBase, joypadStick;

// Función para crear el menú
export function createMenu() {
  menuContainer = document.createElement("div");
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

  // Agregar event listener para las opciones del menú
  menuContainer.addEventListener("click", handleMenuClick);
}

// Función para manejar los clics en el menú
function handleMenuClick(event) {
  const action = event.target.dataset.action;
  switch (action) {
    case "option1":
      console.log("Opción 1 seleccionada");
      break;
    case "option2":
      console.log("Opción 2 seleccionada");
      break;
    case "option3":
      console.log("Opción 3 seleccionada");
      break;
    case "option4":
      console.log("Opción 4 seleccionada");
      break;
    default:
      break;
  }
}

// Función para crear el joypad
export function createJoypad() {
  joypadBase = document.createElement("div");
  joypadBase.classList.add("joypad-base");
  joypadBase.style.cssText = `
    position: absolute;
    bottom: 10%;
    left: 5%;
    width: 100px;
    height: 100px;
    border: 2px solid white;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    touch-action: none;`;

  joypadStick = document.createElement("div");
  joypadStick.classList.add("joypad-stick");
  joypadStick.style.cssText = `
    position: absolute;
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    transform: translate(30%, 30%);`;

  joypadBase.appendChild(joypadStick);
  document.body.appendChild(joypadBase);

  // Eventos para mover el joypad
  joypadBase.addEventListener("touchstart", handleJoypadMove);
  joypadBase.addEventListener("touchmove", handleJoypadMove);
  joypadBase.addEventListener("touchend", resetJoypad);
}

// Función para manejar el movimiento del joypad
function handleJoypadMove(event) {
  console.log("Moviendo el joypad"); // Aquí puedes enlazarlo al movimiento del cubo o personaje
}

// Función para resetear el joypad
function resetJoypad() {
  joypadStick.style.transform = "translate(30%, 30%)";
}
