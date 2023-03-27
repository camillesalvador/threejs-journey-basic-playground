import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const matCapsTextures = {
  'Texture 1': './textures/matcaps/1.png',
  'Texture 2': './textures/matcaps/2.png',
  'Texture 3': './textures/matcaps/3.png',
  'Texture 4': './textures/matcaps/4.png',
  'Texture 5': './textures/matcaps/5.png',
  'Texture 6': './textures/matcaps/6.png',
  'Texture 7': './textures/matcaps/7.png',
  'Texture 8': './textures/matcaps/8.png',
  'Texture 9': './textures/matcaps/9.png',
};

const setupVars = {
  matcap: 'Texture 9',
  text: 'bagel universe'
}
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const gui = new dat.GUI();

/**
 * Fonts
 */
const fontLoader = new FontLoader();
let matcapTexture = textureLoader.load('./textures/matcaps/9.png');
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

gui.add(setupVars, 'matcap', matCapsTextures).onChange((newMatCap) => {
  matcapTexture = textureLoader.load(newMatCap);
  material.matcap = matcapTexture;
});

function loadText(font) {
  const textGeometry = new TextGeometry(setupVars.text, {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
  
  textGeometry.computeBoundingBox();
  
  textGeometry.translate(
    -textGeometry.boundingBox.max.x * 0.5,
    -textGeometry.boundingBox.max.y * 0.5,
    -textGeometry.boundingBox.max.z * 0.5
  );
  
}

fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
  loadText(font);

  gui.add(setupVars, 'text').onChange(() => {
    scene.remove(scene.children[2]);
    loadText(font);
  });
});


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const group = new THREE.Group();
group.rotation.x = 1.5;
scene.add(group);

const donutArray = [];

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  donut.scale.set(scale, scale, scale);
  donutArray.push(donut);
  // scene.add(donut);
  group.add(donut);
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  for (const donut of donutArray) {
    donut.rotation.x = 1 * elapsedTime;
    donut.rotation.y = 1 * elapsedTime;
    donut.rotation.z = 1 * elapsedTime;
  }

  group.rotation.y = 0.05 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
