import { loadThreeScene, unloadThreeScene } from './js/three-scene.js';
import { initLogin } from './js/app.js';

// Variable para la escena activa
let currentScene = null;

// Función para cambiar de escena
function switchScene(sceneName) {
  if (currentScene) {
    currentScene.unload(); // Descargar la escena activa
  }

  if (sceneName === 'login') {
    currentScene = {
      load: initLogin,
      unload: () => console.log('Saliendo de login'),
    };
  } else if (sceneName === 'game') {
    currentScene = {
      load: loadThreeScene,
      unload: unloadThreeScene,
    };
  }

  if (currentScene) {
    currentScene.load(); // Cargar la nueva escena
  }
}

// Inicializar la aplicación en la escena de login
switchScene('login');
