import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Création de la scène et de la caméra
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.fog = new THREE.Fog(0xcccccc, 2, 10);

// Création du renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout de la lumière
const ambientColor = 0xFFFFFF;
const ambientIntensity = 4;
const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
scene.add(ambientLight);

// Ajout de texture pour la terre
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('ressources/earth.jpg');

// Création d'une sphère
const geometry = new THREE.SphereGeometry(3, 32, 32);
const material = new THREE.MeshStandardMaterial({map : earthTexture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


// Position de la caméra
camera.position.set(0, 0, 6);

/**
 * Convertit latitude/longitude en coordonnées cartésiennes
 * @param {number} lat - latitude en degrés
 * @param {number} lon - longitude en degrés
 * @param {number} radius - rayon de la sphère
 * @returns {THREE.Vector3} position 3D
 */
function latLonToVector3(lat, lon, radius) {
  // Conversion degrés → radians
  const phi = THREE.MathUtils.degToRad(90 - lat); // 90° - lat car 0° est à l'équateur
  const theta = THREE.MathUtils.degToRad(lon + 180); // décalage pour orienter correctement

  // Coordonnées sphériques → cartésiennes
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y =  radius * Math.cos(phi);
  const z =  radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

// OrbitControl pour faire tourner la terre
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // effet de fluidité
controls.dampingFactor = 0.05;
controls.enablePan = false; // empêche les déplacements latéraux
controls.minDistance = 3.5;   // distance minimale à la Terre
controls.maxDistance = 9;  // distance maximale
controls.rotateSpeed = 0.5; // vitesse de rotation

// Ajout du repère sur la position de l'utilisateur
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log(`Position lat=${lat}, lon=${lon}`);

      // Convertir en coordonnées 3D
      const markerPosition = latLonToVector3(lat, lon, 3.05);

      // Charger la texture pour le marker
      const textureLoader = new THREE.TextureLoader();
      const markerTexture = textureLoader.load('ressources/markerUser.png');

      // Créer un Sprite pour que l'image reste toujours face caméra
      const spriteMaterial = new THREE.SpriteMaterial({
        map: markerTexture,
        transparent: true
      });
      const marker = new THREE.Sprite(spriteMaterial);

      // Définir la taille du sprite
      marker.scale.set(0.05, 0.05, 1); //Ici la profndeur ne change rien meme si on met 1, 100 ou 1000

      // Positionner le marker sur la sphère
      marker.position.copy(markerPosition);

      // Ajouter le marker à la scène
      scene.add(marker);
      
    },
    (error) => {
      console.error("Erreur de géolocalisation :", error);
    }
  );
} else {
  console.error("La géolocalisation n'est pas supportée par ce navigateur.");
}

function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();


