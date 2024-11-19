import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 10;

// Load environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('/envmap/environment.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
});

// Add floor with logo texture
const textureLoader = new THREE.TextureLoader();
const logoTexture = textureLoader.load('/images/RTfkt-logo2.webp');

const floorGeometry = new THREE.PlaneGeometry(15, 15);
const floorMaterial = new THREE.MeshStandardMaterial({
    map: logoTexture,
    roughness: 0.7,
    metalness: 0.3,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
floor.receiveShadow = true;
scene.add(floor);

// Load 3D model
const loader = new GLTFLoader();
loader.load('/models/sneaker/scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.2, 0.2, 0.2);
    model.position.set(0, -1, 0);
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(model);

    // Add dat.GUI controls for the model
    const modelFolder = gui.addFolder('Model Position');
    modelFolder.add(model.position, 'x', -5, 5).name('X Position');
    modelFolder.add(model.position, 'y', -5, 5).name('Y Position');
    modelFolder.add(model.position, 'z', -5, 5).name('Z Position');
    modelFolder.open();
});

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
scene.add(directionalLight);

// Add dat.GUI for lighting
const gui = new dat.GUI();

const lightFolder = gui.addFolder('Directional Light');
lightFolder.add(directionalLight.position, 'x', -10, 10).name('X Position');
lightFolder.add(directionalLight.position, 'y', 0, 20).name('Y Position');
lightFolder.add(directionalLight.position, 'z', -10, 10).name('Z Position');
lightFolder.add(directionalLight, 'intensity', 0, 2).name('Intensity');
lightFolder.open();

const ambientLightFolder = gui.addFolder('Ambient Light');
ambientLightFolder.addColor({ color: ambientLight.color.getHex() }, 'color')
    .onChange((value) => ambientLight.color.set(value))
    .name('Color');
ambientLightFolder.open();

// Camera position
camera.position.set(0, 2, 7);

// Animation loop
function animate() {
    controls.update(); // Update OrbitControls
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
