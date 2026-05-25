// ==========================================
// 1. IMPORTS (These use the Import Map from HTML!)
// ==========================================
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ==========================================
// 2. SCENE SETUP (World, Camera, Renderer)
// ==========================================
const scene = new THREE.Scene();

// Add Lighting (Otherwise the Blender model will be pure black!)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('stage').appendChild(renderer.domElement);

// ==========================================
// 3. INTERACTIVE CONTROLS (Rotation & Dragging)
// ==========================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// ==========================================
// 4. LOAD THE BLENDER MODEL (The Business Card)
// ==========================================
const loader = new GLTFLoader();

// IMPORTANT: This looks inside the 'digitalassets' folder!
loader.load('../digitalassets/model.glb', function (gltf) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    scene.add(model);
}, undefined, function (error) {
    console.error('Error loading the model:', error);
});

// ==========================================
// 5. ANIMATION LOOP
// ==========================================
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Keeps the physics and auto-rotation running
    renderer.render(scene, camera);
}

animate();
