import * as THREE from 'three';

class ProceduralTerrain {
    constructor(scene) {
        this.scene = scene;
        this.terrainSize = 2000; // Tamaño del terreno
        this.terrainHeight = 200; // Altura máxima del terreno

        this.init();
    }

    async init() {
        await this.loadTextures();
        this.createTerrain();
    }

    async loadTextures() {
        const textureLoader = new THREE.TextureLoader();

        this.grassTexture = await new Promise((resolve, reject) => {
            textureLoader.load('./js/textures/terrain1.jpg', resolve, undefined, reject);
        });

        this.dirtTexture = await new Promise((resolve, reject) => {
            textureLoader.load('./js/textures/terrain2.jpg', resolve, undefined, reject);
        });

        this.grassTexture.wrapS = this.grassTexture.wrapT = THREE.RepeatWrapping;
        this.dirtTexture.wrapS = this.dirtTexture.wrapT = THREE.RepeatWrapping;
    }

    createTerrain() {
        const geometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize, 256, 256);

        // Generar alturas de forma procedural
        const position = geometry.attributes.position;
        for (let i = 0; i < position.count; i++) {
            const x = position.getX(i);
            const y = position.getY(i);

            const height = this.generateHeight(x, y);
            position.setZ(i, height);
        }

        geometry.computeVertexNormals();

        const material = new THREE.ShaderMaterial({
            uniforms: {
                grassTexture: { value: this.grassTexture },
                dirtTexture: { value: this.dirtTexture },
                terrainSize: { value: this.terrainSize },
                terrainHeight: { value: this.terrainHeight },
            },
            vertexShader: `
                varying float vHeight;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    vHeight = position.z / terrainHeight;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D grassTexture;
                uniform sampler2D dirtTexture;
                uniform float terrainHeight;

                varying float vHeight;
                varying vec2 vUv;

                void main() {
                    float blendFactor = smoothstep(0.3, 0.6, vHeight);
                    vec4 grassColor = texture2D(grassTexture, vUv * 10.0); // Repetir textura
                    vec4 dirtColor = texture2D(dirtTexture, vUv * 10.0);
                    gl_FragColor = mix(dirtColor, grassColor, blendFactor);
                }
            `
        });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        this.scene.add(terrain);
    }

    generateHeight(x, y) {
        const scale = 0.002; // Escala para el ruido
        const amplitude = this.terrainHeight;

        // Perlin noise o alguna función procedural simple
        return Math.sin(x * scale) * Math.cos(y * scale) * amplitude;
    }
}

export default ProceduralTerrain;
