import * as THREE from "three";

export function createFloor() {
  // Cargar el mapa de desplazamiento y la textura del terreno
  const textureLoader = new THREE.TextureLoader();
  const displacementMap = textureLoader.load("./js/textures/heightmap.jpg"); // Ruta del mapa de desplazamiento
  const terrainTexture = textureLoader.load("./js/textures/terrain1.jpg"); // Ruta de la textura del terreno

  // Configurar la textura del terreno
  terrainTexture.wrapS = THREE.RepeatWrapping;
  terrainTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(10, 10);

  // Crear material con mapa de desplazamiento
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: terrainTexture, // Textura del terreno
    displacementMap: displacementMap, // Mapa de desplazamiento
    displacementScale: 5, // Ajustar la escala del desplazamiento
  });

  // Crear geometría del terreno
  const floorGeometry = new THREE.PlaneGeometry(50, 50, 256, 256); // Segmentos altos para un desplazamiento suave

  // Crear la malla
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotar para que quede plano
  floor.receiveShadow = true;

  return floor;
}
