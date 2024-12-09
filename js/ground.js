import * as THREE from 'three';

class ProceduralTerrain {
    constructor(size, heightScale, grassTexturePath, dirtTexturePath) {
        this.size = size;
        this.heightScale = heightScale;
        this.grassTexturePath = grassTexturePath;
        this.dirtTexturePath = dirtTexturePath;
        this.init();
    }

    async init() {
        await this.loadTextures();
        this.generateHeightMap();
        this.generateProceduralMap();
    }

    async loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        this.grassTexture = await textureLoader.loadAsync(this.grassTexturePath);
        this.dirtTexture = await textureLoader.loadAsync(this.dirtTexturePath);
    }

    generateHeightMap() {
        const size = this.size;
        this.heightData = new Float32Array(size * size);
        for (let i = 0; i < size * size; i++) {
            this.heightData[i] = Math.random(); // Valores de altura aleatorios
        }
    }

    generateProceduralMap() {
        const canvas = document.createElement('canvas');
        canvas.width = this.size;
        canvas.height = this.size;
        const context = canvas.getContext('2d');

        const grassImage = this.grassTexture.image;
        const dirtImage = this.dirtTexture.image;

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                const index = x + y * this.size;
                const heightValue = this.heightData[index];

                // Mezclar las texturas basadas en el valor de altura
                const grassPixel = this.getPixel(grassImage, x, y);
                const dirtPixel = this.getPixel(dirtImage, x, y);
                const mixedPixel = this.mixPixels(dirtPixel, grassPixel, heightValue);

                this.setPixel(context, x, y, mixedPixel);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        this.exportTexture(texture);
    }

    getPixel(image, x, y) {
        const width = image.width;
        const height = image.height;
        x = Math.floor(x % width);
        y = Math.floor(y % height);
        const context = document.createElement('canvas').getContext('2d');
        context.drawImage(image, 0, 0, width, height);
        const data = context.getImageData(x, y, 1, 1).data;
        return { r: data[0], g: data[1], b: data[2], a: data[3] };
    }

    mixPixels(pixel1, pixel2, factor) {
        return {
            r: pixel1.r * (1 - factor) + pixel2.r * factor,
            g: pixel1.g * (1 - factor) + pixel2.g * factor,
            b: pixel1.b * (1 - factor) + pixel2.b * factor,
            a: pixel1.a * (1 - factor) + pixel2.a * factor,
        };
    }

    setPixel(context, x, y, pixel) {
        const imageData = context.createImageData(1, 1);
        imageData.data[0] = pixel.r;
        imageData.data[1] = pixel.g;
        imageData.data[2] = pixel.b;
        imageData.data[3] = pixel.a;
        context.putImageData(imageData, x, y);
    }

    exportTexture(texture) {
        // Aquí puedes exportar la textura generada y usarla en tu escena
        console.log('Procedural texture generated and ready to be used in your scene:', texture);
    }
}

// Uso:
const proceduralTerrain = new ProceduralTerrain(256, 200, './js/textures/terrain1.jpg', './js/textures/terrain2.jpg');
export default ProceduralTerrain;
