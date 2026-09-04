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
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 8000000);
camera.position.set(0, 110, 240);

// WebGLRenderer with logarithmicDepthBuffer to prevent z-fighting across cosmic scales
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Optimize pixel ratio to max 1.5 to prevent high-DPI / 4K GPU fillrate lag while keeping visuals razor sharp
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2.2, 5000);
scene.add(sunLight);

// Controls with unlimited cosmic orbit distance
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 2;
controls.maxDistance = 5000000;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.enableRotate = true;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 1.0;
controls.panSpeed = 0.7;
controls.enablePan = true;
controls.screenSpacePanning = true;

// Deep Cosmic Galaxy Field (Optimized Unlimited Render Distance Web)
const deepCosmicCount = 6000;
const deepCosmicPositions = new Float32Array(deepCosmicCount * 3);
const deepCosmicColors = new Float32Array(deepCosmicCount * 3);

for (let i = 0; i < deepCosmicCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 350000 + Math.pow(Math.random(), 0.65) * 3200000;

    deepCosmicPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    deepCosmicPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    deepCosmicPositions[i * 3 + 2] = r * Math.cos(phi);

    const col = new THREE.Color();
    if (Math.random() > 0.85) {
        col.setHSL(0.58, 0.6, 0.75); // Distant blue-white galaxy
    } else if (Math.random() > 0.7) {
        col.setHSL(0.08, 0.65, 0.65); // Redshifted deep galaxy
    } else {
        col.setHSL(0.12, 0.25, 0.8); // Faint starlight
    }

    deepCosmicColors[i * 3] = col.r;
    deepCosmicColors[i * 3 + 1] = col.g;
    deepCosmicColors[i * 3 + 2] = col.b;
}

const deepCosmicGeo = new THREE.BufferGeometry();
deepCosmicGeo.setAttribute('position', new THREE.BufferAttribute(deepCosmicPositions, 3));
deepCosmicGeo.setAttribute('color', new THREE.BufferAttribute(deepCosmicColors, 3));

const deepCosmicMat = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: false,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const deepCosmicPoints = new THREE.Points(deepCosmicGeo, deepCosmicMat);
scene.add(deepCosmicPoints);
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

// Raycaster for clicks with point threshold for smooth interactive point clicks
const raycaster = new THREE.Raycaster();
raycaster.params.Points = { threshold: 45 };
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    if (event.clientX > window.innerWidth - 420 && document.getElementById('side-panel').classList.contains('active')) return;
    if (event.target.closest('#dasbor-kiri') || event.target.closest('#cosmic-stages-bar') || event.target.closest('#search-container') || event.target.closest('#tour-hud') || event.target.closest('#library-modal') || event.target.closest('#collision-hud')) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
        const hit = intersects[0];
        let targetObj = hit.object;

        // Handle points cloud clicks (Cosmic catalog objects)
        if (targetObj.isPoints && targetObj.userData && targetObj.userData.isCatalogPoints && typeof hit.index === 'number') {
            const itemData = targetObj.userData.items[hit.index];
            if (itemData) {
                uiManager.showObjectInfo(itemData);
                stageManager.flyToObject(itemData);
                return;
            }
        }

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
