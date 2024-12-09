import * as THREE from "three";

export function createFloor() {
  // Cargar las texturas
  const textureLoader = new THREE.TextureLoader();
  const displacementMap = textureLoader.load("./textures/displacement.png"); // Mapa de desplazamiento
  const grassTexture = textureLoader.load("./textures/grass.jpg"); // Textura de hierba
  const dirtTexture = textureLoader.load("./textures/dirt.jpg"); // Textura de tierra

  // Configurar las texturas
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  dirtTexture.wrapS = dirtTexture.wrapT = THREE.RepeatWrapping;

  grassTexture.repeat.set(10, 10);
  dirtTexture.repeat.set(10, 10);

  // Geometría del terreno
  const width = 50;
  const height = 50;
  const segments = 256;
  const floorGeometry = new THREE.PlaneGeometry(width, height, segments, segments);

  // Shader material
  const floorMaterial = new THREE.ShaderMaterial({
    uniforms: {
      displacementMap: { value: displacementMap },
      displacementScale: { value: 5.0 }, // Escala del desplazamiento
      grassTexture: { value: grassTexture },
      dirtTexture: { value: dirtTexture },
    },
    vertexShader: `
      varying float vDisplacement;

      uniform sampler2D displacementMap;
      uniform float displacementScale;

      void main() {
        // Calcular desplazamiento de la altura
        vec4 disp = texture2D(displacementMap, uv);
        vDisplacement = disp.r * displacementScale;

        // Modificar la posición del vértice
        vec3 newPosition = position + normal * vDisplacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      varying float vDisplacement;

      uniform sampler2D grassTexture;
      uniform sampler2D dirtTexture;

      void main() {
        // Mezclar texturas en función de la altura
        float factor = smoothstep(1.0, 3.0, vDisplacement); // Transición suave entre alturas
        vec4 grassColor = texture2D(grassTexture, gl_FragCoord.xy / 50.0);
        vec4 dirtColor = texture2D(dirtTexture, gl_FragCoord.xy / 50.0);

        // Resultado final
        gl_FragColor = mix(dirtColor, grassColor, factor);
      }
    `,
  });

  // Crear malla
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotar para que quede plano
  floor.receiveShadow = true;

  return floor;
}
