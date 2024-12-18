import * as THREE from "three";
import { TerrainGeometry } from "./TerrainGeometry.js";

export class TerrainMesh {
  static create(vertices, indices) {
    const geometry = TerrainGeometry.create(vertices, indices);
    const material = TerrainGeometry.createMaterial();
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }
}
