import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Création de la scène et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.fog = new THREE.Fog( 0xcccccc, 2, 10 );

// Création du renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.setClearColor(scene.fog.color);
document.body.appendChild( renderer.domElement );

// AJout d'un modèle 3D
const loader3d = new GLTFLoader();

loader3d.load( 'venom/scene.gltf', function ( gltf ) {

gltf.scene.scale.set(0.05, 0.05, 0.05)
  gltf.scene.position.set(4.5, 0, 0)
  scene.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );


// Ajout de la lumière uniformément
const ambientColor = 0xFFFFFF;
const ambientIntensity = 0.3;
const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
scene.add(ambientLight);


//Ajout d'une lumière qui pointe que sur une direction
const directionalColor = 0xFFFFFF;
const directionalIntensity = 5;
const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity); 
directionalLight.position.set(0 , 10, 0);
scene.add(directionalLight);

// Ajout d'une lumière proche de la caméra pour éclairer le modèle
const frontLight = new THREE.DirectionalLight(0xffffff, 1);
frontLight.position.set(0, 2, 5); 
scene.add(frontLight);




// Texturisation du cube en rajoutant une image
const loader = new THREE.TextureLoader();
const texture = loader.load('memes.png');

// Création du cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { map:texture } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Position de la caméra
camera.position.set(0, 2, 6);

scene.fog = new THREE.Fog(0x000000, 5, 20);
renderer.setClearColor(scene.fog.color);

// Fonction pour faire rotationner le cube
function animate() {

  //cube.rotation.x += 0.01;
  //cube.rotation.y += 0.01;
  cube.rotation.x = THREE.MathUtils.degToRad(beta);
  cube.rotation.y = THREE.MathUtils.degToRad(gamma);
  cube.rotation.z = THREE.MathUtils.degToRad(alpha);

  renderer.render( scene, camera );

}

let alpha = 0, beta = 0, gamma = 0;

// Demander la permission sur iOS
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  document.body.addEventListener('click', () => {
    DeviceOrientationEvent.requestPermission().then(response => {
      if (response === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }).catch(console.error);
  });
} else {
  window.addEventListener('deviceorientation', handleOrientation);
}

function handleOrientation(event){
  alpha = event.alpha;
  beta = event.beta;
  gamma = event.gamma;
}

const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true; // mouvement plus fluide
controls.dampingFactor = 0.05;
controls.enablePan = false;    // désactiver le déplacement latéral
controls.enableZoom = true;    // autoriser le zoom

// Paramètres de la pluie
const rainCount = 1000;
const rainGeometry = new THREE.BufferGeometry();
const rainPositions = [];

// Générer des positions aléatoires pour chaque goutte
for (let i = 0; i < rainCount; i++) {
  rainPositions.push(
    Math.random() * 20 - 10, // x
    Math.random() * 10,      // y
    Math.random() * 20 - 10  // z
  );
}

rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainPositions, 3));

const rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
  transparent: true
});

// Créer l’objet Points
const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);
