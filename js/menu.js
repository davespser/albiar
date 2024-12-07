<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menú Superpuesto</title>
  <style>
    /* Contenedor principal del menú */
    #menu-container {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.8);
      padding: 10px;
      border-radius: 8px;
      z-index: 100; /* Siempre por encima */
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    /* Estilo de las opciones del menú */
    .menu-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 10px;
      color: white;
      font-size: 18px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      transition: background 0.3s, transform 0.2s;
    }

    /* Icono dentro de cada opción */
    .menu-item span {
      margin-right: 10px;
      font-size: 20px;
    }

    /* Efecto hover */
    .menu-item:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(10px);
    }
  </style>
</head>
<body>
  <!-- Contenedor del menú -->
  <div id="menu-container">
    <div class="menu-item" data-action="option1">
      <span>🔧</span> Opción 1
    </div>
    <div class="menu-item" data-action="option2">
      <span>🎵</span> Opción 2
    </div>
    <div class="menu-item" data-action="option3">
      <span>📷</span> Opción 3
    </div>
    <div class="menu-item" data-action="option4">
      <span>⚙️</span> Opción 4
    </div>
  </div>

  <script>
    // Manejar eventos de clic en las opciones del menú
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');
        console.log(`Has seleccionado: ${action}`);
        // Aquí puedes añadir lógica personalizada según la opción seleccionada
      });
    });
  </script>
</body>
</html>
