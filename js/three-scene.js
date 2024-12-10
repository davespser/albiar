import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TerrainMesh } from "../js/terrain2/TerrainMesh.js";
import { createMenu, createJoypad, createStats } from "./ui.js"; // Interfaz personalizada

let scene, camera, renderer, cube, robot, light, mixer;
let speed = 0.02; // Velocidad inicial
let cameraOffset = new THREE.Vector3(0, 5, 10); // Offset de la cámara detrás del cubo
const clock = new THREE.Clock();

class TerrainGenerator {
    constructor(segments, width, height) {
        this.segments = segments;
        this.width = width;
        this.height = height;
    }

    generateHeight(x, z) {
        return Math.sin(x * z);
    }

    generate() {
        const vertices = [];
        const indices = [];

        for (let y = 0; y <= this.segments; y++) {
            for (let x = 0; x <= this.segments; x++) {
                const xPos = (x / this.segments - 0.5) * this.width;
                const zPos = (y / this.segments - 0.5) * this.height;
                const yPos = this.generateHeight(xPos, zPos);

                vertices.push(xPos, yPos, zPos);
            }
        }

        for (let y = 0; y < this.segments; y++) {
            for (let x = 0; x < this.segments; x++) {
                const a = x + (this.segments + 1) * y;
                const b = x + (this.segments + 1) * (y + 1);
                const c = (x + 1) + (this.segments + 1) * (y + 1);
                const d = (x + 1) + (this.segments + 1) * y;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        return { vertices, indices };
    }
}

function createTerrainMesh(vertices, indices) {
    return TerrainMesh.create(vertices, indices);
}

export function loadThreeScene({ x = 0, y = 0, z = 0, color = 0xff4500, stats = {} }) {
    // Configuración básica
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(x + 10, y + 5, z + 10);
    camera.lookAt(x, y, z);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    document.body.innerHTML = ""; // Limpiar DOM
    document.body.appendChild(renderer.domElement);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    light = new THREE.PointLight(0xffffff, 1, 100);
    scene.add(light);

    // Terreno procedural
    const terrainGenerator = new TerrainGenerator(64, 100, 100);
    const { vertices, indices } = terrainGenerator.generate();
    const terrain = createTerrainMesh(vertices, indices);
    scene.add(terrain);

    // Cubo con propiedades del usuario
    const textureLoader = new THREE.TextureLoader();
    const specularMap = textureLoader.load("./js/Specularbox.png");

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({
        color,
        specular: 0xffffff,
        shininess: 100,
        specularMap,
    });

    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y + 0.5, z);
    cube.castShadow = true;
    scene.add(cube);

    // Modelo GLTF
    const loader = new GLTFLoader();
    loader.load(
        "./models/npc/robotauro_walk.glb",
        (gltf) => {
            robot = gltf.scene;
            robot.position.set(x, y + 2.5, z);
            robot.scale.set(0.05, 0.05, 0.05);
            robot.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });
            scene.add(robot);

            mixer = new THREE.AnimationMixer(robot);
            if (gltf.animations.length > 0) {
                const walkAction = mixer.clipAction(gltf.animations[0]);
                walkAction.play();
            }
        },
        undefined,
        (error) => {
            console.error("Error al cargar el modelo: ", error);
        }
    );

    // Controles
    window.addEventListener("keydown", handleKeyDown);

    // Interfaz
    createJoypad((stickX, stickY) => {
        if (cube) {
            cube.position.x += stickX * 0.1;
            cube.position.z += stickY * 0.1;
        }
    });
    createStats(stats);
    createMenu();

    animate();
}

function handleKeyDown(event) {
    if (!cube) return;

    switch (event.key) {
        case "ArrowUp":
            cube.position.z += speed;
            break;
        case "ArrowDown":
            cube.position.z -= speed;
            break;
        case "ArrowLeft":
            cube.position.x -= speed;
            break;
        case "ArrowRight":
            cube.position.x += speed;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    if (robot) {
        robot.position.z -= speed / 2;
        robot.rotation.y = Math.PI;
    }

    if (cube) {
        const desiredPosition = new THREE.Vector3().addVectors(cube.position, cameraOffset);
        camera.position.lerp(desiredPosition, 0.1);
        camera.lookAt(cube.position);
    }

    light.position.copy(cube.position).add(new THREE.Vector3(0, 2, 0));

    renderer.render(scene, camera);
}

export function unloadThreeScene() {
    if (renderer) {
        renderer.dispose();
        document.body.innerHTML = "";
    }
}
