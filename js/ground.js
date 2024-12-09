import * as THREE from 'three';

class ProceduralTerrain {
    constructor(scene, assets) {
        this.scene = scene;
        this.assets = assets;
        this.terrainSize = 2000; // Tamaño del terreno
        this.terrainHeight = 200; // Altura máxima del terreno
        this.numGrassBlades = 500_000; // Número de hojas de hierba

        this.init();
    }

    async init() {
        await this.loadAssets();
        this.createTerrain();
        this.createGrass();
        this.addFog();

        this.wind = { intensity: 0.5, direction: new THREE.Vector3(0.5, 0, 0.5).normalize() };
        this.animate();
    }

    async loadAssets() {
        this.heightMap = await this.loadTexture('./js/textures/heightmap.jpg');
        this.grassTexture = await this.loadTexture('./js/textures/grass.jpg');
        this.dirtTexture = await this.loadTexture('./js/textures/terrain2.jpg');
    }

    async loadTexture(path) {
        return new Promise((resolve, reject) => {
            new THREE.TextureLoader().load(path, resolve, undefined, reject);
        });
    }

    createTerrain() {
        if (!this.heightMap || !this.heightMap.image) {
            console.error("El mapa de altura no está cargado correctamente.");
            return;
        }

        const geometry = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize, 255, 255); // Ajustado a 255 segmentos para 256 puntos
        const positionAttribute = geometry.attributes.position;

        // Verificar que el mapa de alturas tiene suficientes datos
        const heightData = this.getHeightData(this.heightMap.image);

        if (heightData.length !== (geometry.parameters.widthSegments + 1) * (geometry.parameters.heightSegments + 1)) {
            console.error("El tamaño de heightData no coincide con la cantidad de vértices.");
            return;
        }

        for (let i = 0; i < positionAttribute.count; i++) {
            const z = heightData[i] * this.terrainHeight;
            positionAttribute.setZ(i, z);
        }
        positionAttribute.needsUpdate = true;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                grassTexture: { value: this.grassTexture },
                dirtTexture: { value heightScale: { value: this.terrainHeight }
            },
            vertexShader: `
                varying float vHeight;
                void main() {
                    vHeight = position.z;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D grassTexture;
                uniform sampler2D dirtTexture;
                uniform float heightScale;
                varying float vHeight;
                void main() {
                    float factor = smoothstep(0.0, heightScale * 0.5, vHeight);
                    vec4 grass = texture2D(grassTexture, gl_FragCoord.xy / 1024.0);
                    vec4 dirt = texture2D(dirtTexture, gl_FragCoord.xy / 1024.0);
                    gl_FragColor = mix(dirt, grass, factor);
                }
            `
        });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        this.scene.add(terrain);
    }

    createGrass() {
        const grassGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < this.numGrassBlades; i++) {
            const x = (Math
