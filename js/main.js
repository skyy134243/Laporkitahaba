import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCelestialFactory } from './renderers/celestialFactory.js';
import { createGalaxyFactory } from './renderers/galaxyFactory.js';
import { createCollisionExperiment } from './renderers/collisionExperiment.js';
import { createStageManager } from './stages/stageManager.js';
import { createUIManager } from './ui/uiManager.js';
import { cosmicLibrary } from './data/cosmicLibraryData.js';

// Setup Three.js Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030308);

// Camera with wide clipping range supported by logarithmicDepthBuffer
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 150000);
camera.position.set(0, 110, 240);

// WebGLRenderer with logarithmicDepthBuffer to prevent z-fighting across cosmic scales
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2.2, 5000);
scene.add(sunLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2;
controls.maxDistance = 120000;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.enableRotate = true;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 1.0;
controls.panSpeed = 0.7;
controls.enablePan = true;
controls.screenSpacePanning = true;

// Registry of clickable interactive celestial & galactic objects
const interactiveObjects = [];

// Instantiate factories & managers
const celestialFactory = createCelestialFactory(scene, interactiveObjects);
const galaxyFactory = createGalaxyFactory(scene, interactiveObjects);
const stageManager = createStageManager(camera, controls, scene);
const collisionExperiment = createCollisionExperiment(scene, camera, controls);

const uiManager = createUIManager(stageManager, interactiveObjects, cosmicLibrary, (selectedMesh) => {
    // Callback when an object is selected
}, collisionExperiment);

// Initialize Scene Elements
celestialFactory.initSolarSystem();
galaxyFactory.initGalaxies(cosmicLibrary);

// Raycaster for clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    if (event.clientX > window.innerWidth - 420 && document.getElementById('side-panel').classList.contains('active')) return;
    if (event.target.closest('#dasbor-kiri') || event.target.closest('#cosmic-stages-bar') || event.target.closest('#search-container') || event.target.closest('#tour-hud') || event.target.closest('#library-modal') || event.target.closest('#collision-hud')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
        const targetObj = intersects[0].object;
        uiManager.showObjectInfo(targetObj.userData);
        stageManager.flyToObject(targetObj);
    }
});

// Render Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    celestialFactory.update(delta);
    galaxyFactory.update(delta);
    stageManager.update(delta);
    collisionExperiment.update(delta);

    controls.update();
    renderer.render(scene, camera);
}
animate();

// Responsive window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log("🌌 Cosmic Galaxy Simulator framework initialized successfully. 49 NASA Galaxies ready.");
