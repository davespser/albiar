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
        this.grassTexture = await this.loadTexture('./js/textures/terrain1.jpg');
        this.dirtTexture = await this.loadTexture('./js/textures/terrain1.jpg');
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
            dirtTexture: { value: this.dirtTexture },
            heightScale: { value: this.terrainHeight }
        },
        vertexShader: `
            uniform float heightScale;
            varying float vHeight;
            varying vec2 vUv;
            void main() {
                vHeight = position.z;
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D grassTexture;
            uniform sampler2D dirtTexture;
            uniform float heightScale;
            varying float vHeight;
            varying vec2 vUv;
            void main() {
                float factor = smoothstep(0.0, heightScale * 0.5, vHeight);
                vec4 grass = texture2D(grassTexture, vUv);
                vec4 dirt = texture2D(dirtTexture, vUv);
                gl_FragColor = mix(dirt, grass, factor);
            }
        `
    });

    const terrain = new THREE.Mesh(geometry, material

    createGrass() {
        const grassGeometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < this.numGrassBlades; i++) {
            const x = (Math.random() - 0.5) * this.terrainSize;
            const z = (Math.random() - 0.5) * this.terrainSize;
            const y = 0; // Colocar en la superficie

            positions.push(x, y, z);
            colors.push(0.3, 0.9, 0.3); // Verde hierba
        }

        grassGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        grassGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const grassMaterial = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true
        });

        const grass = new THREE.Points(grassGeometry, grassMaterial);
        this.scene.add(grass);
    }

    addFog() {
        this.scene.fog = new THREE.Fog(0xcccccc, 500, 2000);
    }

    getHeightData(image) {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = new Float32Array(imageData.width * imageData.height);

        for (let i = 0; i < data.length; i++) {
            data[i] = imageData.data[i * 4] / 255; // Usar el canal rojo (normalizar entre 0 y 1)
        }

        return data;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.updateWind();
    }

    updateWind() {
        this.wind.intensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5; // Variación en intensidad
        // Aquí puedes agregar lógica para mover hierba según el viento
    }
}

export default ProceduralTerrain;
