import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { TerrainMesh } from "../js/terrain2/TerrainMesh.js";
import { createMenu, createJoypad, createStats } from "./ui.js";
import Ammo from "https://cdn.jsdelivr.net/npm/ammo.js@0.0.10/ammo.js";

let scene, camera, renderer, cube, robot, light, mixer, physicsWorld, transform, cubeBody;
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

async function initPhysics() {
    const AmmoLib = await Ammo(); // Asegurarse de que Ammo está cargado
    const collisionConfiguration = new AmmoLib.btDefaultCollisionConfiguration();
    const dispatcher = new AmmoLib.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new AmmoLib.btDbvtBroadphase();
    const solver = new AmmoLib.btSequentialImpulseConstraintSolver();

    physicsWorld = new AmmoLib.btDiscreteDynamicsWorld(
        dispatcher,
        overlappingPairCache,
        solver,
        collisionConfiguration
    );
    physicsWorld.setGravity(new AmmoLib.btVector3(0, -9.8, 0)); // Gravedad

    transform = new AmmoLib.btTransform();
}

function addPhysicalTerrain(terrain, AmmoLib) {
    const shape = new AmmoLib.btBvhTriangleMeshShape(
        terrain.geometry.attributes.position.array,
        true
    );

    const transform = new AmmoLib.btTransform();
    transform.setIdentity();

    const motionState = new AmmoLib.btDefaultMotionState(transform);

    const localInertia = new AmmoLib.btVector3(0, 0, 0);
    const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(0, motionState, shape, localInertia);
    const body = new AmmoLib.btRigidBody(rbInfo);

    physicsWorld.addRigidBody(body);
}

function addPhysicalCube(cube, AmmoLib) {
    const shape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(0.5, 0.5, 0.5));

    const transform = new AmmoLib.btTransform();
    transform.setIdentity();
    transform.setOrigin(new AmmoLib.btVector3(cube.position.x, cube.position.y, cube.position.z));

    const motionState = new AmmoLib.btDefaultMotionState(transform);

    const mass = 1; // Masa del cubo
    const localInertia = new AmmoLib.btVector3(0, 0, 0);
    shape.calculateLocalInertia(mass, localInertia);

    const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
    const body = new AmmoLib.btRigidBody(rbInfo);

    physicsWorld.addRigidBody(body);

    return body; // Devuelve el cuerpo físico
}

export async function loadThreeScene({ x = 0, y = 0, z = 0, color = 0xff4500, stats = {} }) {
    await initPhysics();

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
    addPhysicalTerrain(terrain, Ammo);

    // Cubo con propiedades del usuario
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({
        color,
    });

    cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y + 0.5, z);
    cube.castShadow = true;
    scene.add(cube);

    cubeBody = addPhysicalCube(cube, Ammo);

    // Eventos táctiles
    let touchStartX, touchStartY;

    window.addEventListener("touchstart", (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener("touchmove", (event) => {
        if (!cube) return;

        const deltaX = event.touches[0].clientX - touchStartX;
        const deltaY = event.touches[0].clientY - touchStartY;

        cube.position.x += deltaX * 0.01;
        cube.position.z -= deltaY * 0.01;

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

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

function updatePhysics(deltaTime) {
    if (!physicsWorld) return;

    physicsWorld.stepSimulation(deltaTime, 10);

    if (cube && cubeBody) {
        const motionState = cubeBody.getMotionState();
        if (motionState) {
            motionState.getWorldTransform(transform);

            const origin = transform.getOrigin();
            const rotation = transform.getRotation();
            cube.position.set(origin.x(), origin.y(), origin.z());
            cube.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    updatePhysics(delta);

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
}
