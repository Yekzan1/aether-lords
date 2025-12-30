/**
 * AETHER LORDS - Main Module
 * Orchestrates initialization, UI events, and game loop.
 */

import { Network } from './network.js';
import { Graphics } from './graphics.js';
import { Gameplay } from './gameplay.js';
import { Cards } from './assets.js';

class Game {
    constructor() {
        this.graphics = new Graphics();
        this.gameplay = new Gameplay(this.graphics);
        this.isStarted = false;

        this.initUI();
    }

    initUI() {
        const btnLogin = document.getElementById('btn-login');
        const emailInput = document.getElementById('email');
        const passInput = document.getElementById('password');

        btnLogin.addEventListener('click', async () => {
            const email = emailInput.value;
            const pass = passInput.value;

            if (!email || !pass) return alert('Please enter credentials');

            try {
                btnLogin.innerText = 'AUTHENTICATING...';
                btnLogin.disabled = true;
                console.log("Starting auth process...");
                await Network.auth(email, pass);
                console.log("Auth process finished, starting game...");
                this.startGame();
            } catch (err) {
                console.error("Login error:", err);
                alert('Auth Error: ' + err + "\n\nTip: If it hangs, try refreshing or using a different email/pass.");
                btnLogin.innerText = 'ENTER ARENA';
                btnLogin.disabled = false;
            }
        });
    }

    startGame() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('game-hud').style.display = 'block';
        this.isStarted = true;

        this.renderCards();
        this.gameLoop();

        // Start Enemy Spawning (Simple AI)
        setInterval(() => {
            if (this.isStarted) {
                const randomCard = Cards[Math.floor(Math.random() * Cards.length)];
                this.gameplay.spawnUnit(randomCard, false);
            }
        }, 5000);
    }

    renderCards() {
        const hud = document.getElementById('hud');
        hud.innerHTML = '';
        
        Cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.innerHTML = `
                <div style="color: #${card.color.toString(16)}">${card.name}</div>
                <div style="margin-top: 5px;">💧 ${card.cost}</div>
            `;
            cardEl.addEventListener('click', () => {
                if (this.gameplay.spawnUnit(card, true)) {
                    console.log('Spawned', card.name);
                } else {
                    cardEl.style.borderColor = 'red';
                    setTimeout(() => cardEl.style.borderColor = '', 500);
                }
            });
            hud.appendChild(cardEl);
        });
    }

    gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        if (this.isStarted) {
            this.gameplay.update();
            
            // Update UI
            document.getElementById('mana-fill').style.width = `${(this.gameplay.mana / this.gameplay.maxMana) * 100}%`;
            document.getElementById('aether-val').innerText = Math.floor(this.gameplay.aether);
        }

        this.graphics.render();
    }
}

// Initialize Game
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
