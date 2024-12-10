import * as THREE from 'three';

export class TerrainGeometry {
  static create(vertices, indices) {
    const geometry = new THREE.BufferGeometry();
    
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }

  static createMaterial() {
    return new THREE.MeshPhongMaterial({
      color: 0x3c8f3c,
      wireframe: false,
      flatShading: true,
      side: THREE.DoubleSide
    });
  }
}
