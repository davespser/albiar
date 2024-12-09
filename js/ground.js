import * as THREE from "three";

export default class ProceduralTerrain {
    constructor(heightMapSize, size, texture1Path, texture2Path, scene = null) {
        this.heightMapSize = heightMapSize;
        this.size = size;
        this.texture1Path = texture1Path;
        this.texture2Path = texture2Path;
        this.scene = scene; // Referencia a la escena
        this.heightData = null;
        this.textures = null;
    }

    async init() {
        await this.loadTextures();
        this.generateHeightMap();
        this.createTerrain();
    }

    async loadTextures() {
        const loader = new THREE.TextureLoader();
        const texture1 = loader.load(this.texture1Path);
        const texture2 = loader.load(this.texture2Path);

        // Configurar texturas
        texture1.wrapS = texture1.wrapT = THREE.RepeatWrapping;
        texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;

        this.textures = { texture1, texture2 };
    }

    generateHeightMap() {
        const size = this.heightMapSize * this.heightMapSize;
        this.heightData = new Float32Array(size);

        for (let i = 0; i < size; i++) {
            this.heightData[i] = Math.random() * 10; // Alturas aleatorias (puedes ajustar)
        }
    }

    exportTexture() {
        if (!this.textures) {
            console.error("Las texturas no han sido cargadas.");
            return null;
        }
        return this.textures.texture1; // Por simplicidad, devolver textura 1
    }

    createTerrain() {
        if (!this.heightData) {
            console.error("No se ha generado el mapa de alturas.");
            return;
        }

        const geometry = new THREE.PlaneGeometry(
            this.size,
            this.size,
            this.heightMapSize - 1,
            this.heightMapSize - 1
        );

        // Aplicar alturas al terreno
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const y = this.heightData[i];
            geometry.attributes.position.setY(i, y);
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshLambertMaterial({ map: this.exportTexture() });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;

        // Agregar terreno a la escena
        if (this.scene) {
            this.scene.add(terrain);
        } else {
            console.warn("No se ha proporcionado una escena para ProceduralTerrain.");
        }
    }
}
