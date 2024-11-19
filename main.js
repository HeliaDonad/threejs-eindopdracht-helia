import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const loader = new THREE.GLTFLoader();
loader.load('/models/sneaker/scene.gltf', (gltf) => {
  scene.add(gltf.scene);
});

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

camera.position.z = 5;

function animate() {

	renderer.render( scene, camera );

}