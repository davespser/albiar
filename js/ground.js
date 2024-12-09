import * as THREE from "three";

export function createFloor() {
  // Cargar el mapa de desplazamiento y la textura del terreno
  const textureLoader = new THREE.TextureLoader();
  const displacementMap = textureLoader.load("./js/textures/displacement.png"); // Imagen 2157x2244
  const terrainTexture = textureLoader.load("./js/textures/terrain.jpg");

  // Relación de aspecto de la imagen
  const aspectRatio = 2157 / 2244; // Ancho / Alto

  // Dimensiones del terreno
  const width = 50; // Ancho deseado
  const height = width / aspectRatio; // Alto ajustado

  // Configurar la textura del terreno
  terrainTexture.wrapS = THREE.RepeatWrapping;
  terrainTexture.wrapT = THREE.RepeatWrapping;
  terrainTexture.repeat.set(width / 10, height / 10);

  // Crear material con mapa de desplazamiento
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: terrainTexture, // Textura del terreno
    displacementMap: displacementMap, // Mapa de desplazamiento
    displacementScale: 5, // Ajustar la intensidad del desplazamiento
  });

  // Crear geometría del terreno
  const floorGeometry = new THREE.PlaneGeometry(width, height, 256, 256);

  // Crear la malla
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotar para que quede plano
  floor.receiveShadow = true;

  return floor;
}
