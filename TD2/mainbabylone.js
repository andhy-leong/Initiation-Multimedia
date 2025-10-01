// Récupérer le canvas
const canvas = document.getElementById("renderCanvas");

// Créer le moteur Babylon
const engine = new BABYLON.Engine(canvas, true);

// Créer la scène
const createScene = function () {
    const scene = new BABYLON.Scene(engine);

    // Ajouter une caméra qui tourne autour de la sphère
    const camera = new BABYLON.ArcRotateCamera(
        "camera1",
        -Math.PI / 2,
        Math.PI / 2.5,
        10,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);

    // Ajouter une lumière
    const light = new BABYLON.HemisphericLight(
        "light1",
        new BABYLON.Vector3(1, 1, 0),
        scene
    );

    // Ajouter une sphère
    const sphere = BABYLON.MeshBuilder.CreateSphere(
        "sphere",
        { diameter: 2, segments: 32 },
        scene
    );

    return scene;
};

// Créer la scène
const scene = createScene();

// Boucle de rendu
engine.runRenderLoop(function () {
    scene.render();
});

// Ajuster le moteur si la fenêtre change de taille
window.addEventListener("resize", function () {
    engine.resize();
});
