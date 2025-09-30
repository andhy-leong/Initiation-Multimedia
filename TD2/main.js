import * as THREE from 'three';

// Création de la scène et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Création du renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// Ajout de la lumière uniformément
const ambientColor = 0xFFFFFF;
const ambientIntensity = 1;
const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
scene.add(ambientLight);

//Ajout d'une lumière qui pointe que sur une direction
const directionalColor = 0xffaa00;
const directionalIntensity = 5;
//const directionalDistance = 10; // C'est la distance jusqu'où la lumière éclaire
//const directionalDecay = 2; // Décroissance de l'intensité avec la distance
//const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity, directionalDistance, directionalDecay);
const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity); 
directionalLight.position.set(0 , 10, 0);
scene.add(directionalLight);


// Texturisation du cube en rajoutant une image
const loader = new THREE.TextureLoader();
const texture = loader.load('memes.png');

// Création du cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { map:texture } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// Position de la caméra
camera.position.z = 5;

// Fonction pour faire rotationner le cube
function animate() {

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

}
