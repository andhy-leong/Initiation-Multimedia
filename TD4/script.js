// Attendre que la page soit complètement chargée
window.addEventListener('load', function () {

    // 1. Récupérer les éléments HTML
    const video = document.getElementById('video');
    const resultatElement = document.getElementById('resultat');
    let classifier;

    // 2. Mettre en place et lancer le processus
    // On utilise une fonction 'async' pour pouvoir utiliser 'await' à l'intérieur
    async function setup() {
        try {
            // Demander l'accès à la caméra
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;

            // Attendre que la vidéo soit prête à être lue
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    resolve();
                };
            });

            // Charger le modèle de reconnaissance d'image
            // 'await' met en pause la fonction jusqu'à ce que le modèle soit chargé
            classifier = await ml5.imageClassifier('MobileNet');
            resultatElement.innerText = "Pointez la caméra sur un objet";

            // Lancer la boucle de classification
            classifyLoop();

        } catch (err) {
            console.error("Erreur lors de l'initialisation : ", err);
            resultatElement.innerText = "Erreur : Impossible d'initialiser.";
        }
    }

    // 3. La boucle de classification continue
    async function classifyLoop() {
        // 'await' met en pause la boucle jusqu'à ce qu'une classification soit terminée
        const results = await classifier.classify(video);
        
        // On récupère la prédiction la plus probable
        const prediction = results[0];
        resultatElement.innerText = `${prediction.label} (${(prediction.confidence * 100).toFixed(0)}%)`;

        // On relance la boucle pour la prochaine image
        classifyLoop();
    }

    // Lancer tout le processus
    setup();
});