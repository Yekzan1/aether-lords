import { loginUser, registerUser, checkAuthState } from './network.js';
import { initGraphics, animate } from './graphics.js';
import { initGameLogic } from './gameplay.js';

// --- ÉLÉMENTS DE L'INTERFACE (UI) ---
const loginScreen = document.getElementById('login-screen');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const loadingScreen = document.getElementById('loading-screen');

/**
 * Initialisation au chargement de la page
 */
window.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Aether Lords: Initialisation...");

    // 1. Écouteurs pour le système de compte
    setupEventListeners();

    // 2. Vérifier si l'utilisateur est déjà connecté (Auto-login)
    checkAuthState((user) => {
        if (user) {
            console.log("✅ Utilisateur déjà authentifié :", user.alias);
            startGame();
        }
    });
});

/**
 * Gestion des clics sur les boutons de connexion
 */
function setupEventListeners() {
    // Bouton SE CONNECTER
    loginBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const pass = passInput.value;

        if (email && pass) {
            showLoading(true);
            loginUser(email, pass, (success, error) => {
                if (success) {
                    startGame();
                } else {
                    showLoading(false);
                    alert("Échec de connexion : " + error);
                }
            });
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });

    // Bouton S'INSCRIRE
    signupBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const pass = passInput.value;

        if (email && pass) {
            showLoading(true);
            registerUser(email, pass, (success, error) => {
                showLoading(false);
                if (success) {
                    alert("Compte créé avec succès ! Connectez-vous maintenant.");
                } else {
                    alert("Erreur d'inscription : " + error);
                }
            });
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });
}

/**
 * Lance le moteur du jeu (3D + Logique)
 */
function startGame() {
    console.log("🎮 Lancement du monde 3D...");
    
    // Cacher l'UI de connexion
    loginScreen.classList.add('hidden');
    showLoading(true);

    // Initialiser la 3D (Graphics.js)
    const sceneLoaded = initGraphics();

    if (sceneLoaded) {
        // Initialiser la logique des cartes et du combat (Gameplay.js)
        initGameLogic();

        // Lancer la boucle de rendu
        animate();

        console.log("✨ Aether Lords est prêt !");
        setTimeout(() => showLoading(false), 1000);
    }
}

/**
 * Affiche ou cache l'écran de chargement
 */
function showLoading(state) {
    if (loadingScreen) {
        loadingScreen.style.display = state ? 'flex' : 'none';
    }
}
