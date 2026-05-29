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
camera.position.z = 5; // updated after model loads

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

loader.load('digitalassets/techjcorpcardasset.glb', function (gltf) {
    const model = gltf.scene;
    scene.add(model);

    // Traverse every mesh in the GLTF scene to get a true bounding box
    const box = new THREE.Box3();
    model.traverse(function (child) {
        if (child.isMesh) {
            child.geometry.computeBoundingBox();
            const childBox = child.geometry.boundingBox.clone();
            childBox.applyMatrix4(child.matrixWorld);
            box.union(childBox);
        }
    });

    // Centre the model on the origin
    const centre = new THREE.Vector3();
    box.getCenter(centre);
    model.position.sub(centre);

    // Recompute box after centering
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Pull camera back far enough to see the whole model
    const fovRad = THREE.MathUtils.degToRad(camera.fov / 2);
    const fitDistance = (maxDim / 2) / Math.tan(fovRad) * 2.5;

    camera.position.set(0, 0, fitDistance);
    camera.near = fitDistance / 100;
    camera.far  = fitDistance * 100;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.minDistance = fitDistance * 0.5;
    controls.maxDistance = fitDistance * 5;
    controls.update();

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
