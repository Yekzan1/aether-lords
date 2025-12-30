/**
 * AETHER LORDS - Gameplay Module
 * Handles Mana, Unit Spawning, AI, and Combat Logic.
 */

export class Gameplay {
    constructor(graphics) {
        this.graphics = graphics;
        this.units = [];
        this.mana = 5;
        this.maxMana = 10;
        this.aether = 0;
        this.manaRate = 0.01; // Per frame
        
        this.init();
    }

    init() {
        // Start mana regeneration
        this.update();
    }

    spawnUnit(cardData, isPlayer = true) {
        if (isPlayer && this.mana < cardData.cost) return false;

        if (isPlayer) this.mana -= cardData.cost;

        const position = {
            x: (Math.random() - 0.5) * 5,
            y: 0.5,
            z: isPlayer ? 8 : -8
        };

        const mesh = this.graphics.createUnit(cardData.type, cardData.color, position);
        
        const unit = {
            id: Math.random().toString(36).substr(2, 9),
            type: cardData.type,
            hp: cardData.hp,
            maxHp: cardData.hp,
            damage: cardData.damage,
            speed: cardData.speed,
            isPlayer: isPlayer,
            mesh: mesh,
            target: null
        };

        this.units.push(unit);
        this.createHealthBar(unit);
        return true;
    }

    createHealthBar(unit) {
        const bar = document.createElement('div');
        bar.className = 'health-bar';
        bar.innerHTML = `<div class="health-fill" style="width: 100%; background: ${unit.isPlayer ? '#00ff00' : '#ff0000'}"></div>`;
        document.getElementById('ui-overlay').appendChild(bar);
        unit.healthBar = bar;
    }

    updateHealthBars() {
        this.units.forEach(unit => {
            if (unit.mesh && unit.healthBar) {
                const vector = unit.mesh.position.clone();
                vector.y += 1.5;
                vector.project(this.graphics.camera);

                const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

                unit.healthBar.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
                const fill = unit.healthBar.querySelector('.health-fill');
                fill.style.width = `${(unit.hp / unit.maxHp) * 100}%`;
            }
        });
    }

    update() {
        // Mana Regen
        if (this.mana < this.maxMana) {
            this.mana += this.manaRate;
        }

        // Unit Movement & Combat
        this.units.forEach((unit, index) => {
            // Simple AI: Move towards enemy side
            const direction = unit.isPlayer ? -1 : 1;
            unit.mesh.position.z += unit.speed * direction;

            // Check for collisions/combat
            this.units.forEach(other => {
                if (unit.isPlayer !== other.isPlayer) {
                    const dist = unit.mesh.position.distanceTo(other.mesh.position);
                    if (dist < 1) {
                        other.hp -= unit.damage / 60; // Damage per frame
                    }
                }
            });

            // Remove dead units
            if (unit.hp <= 0) {
                this.graphics.scene.remove(unit.mesh);
                if (unit.healthBar) unit.healthBar.remove();
                this.units.splice(index, 1);
                if (!unit.isPlayer) this.aether += 10;
            }
        });

        this.updateHealthBars();
        this.checkAetherWellControl();
    }

    // Skill-shot logic: Meteor Strike
    castMeteor(targetPos) {
        if (this.mana < 5) return;
        this.mana -= 5;

        const meteorGeo = new THREE.SphereGeometry(0.5, 16, 16);
        const meteorMat = new THREE.MeshBasicMaterial({ color: 0xff4500 });
        const meteor = new THREE.Mesh(meteorGeo, meteorMat);
        meteor.position.set(targetPos.x, 10, targetPos.z);
        this.graphics.scene.add(meteor);

        // Animation logic would go here, for now immediate impact
        setTimeout(() => {
            this.units.forEach(unit => {
                const dist = unit.mesh.position.distanceTo(targetPos);
                if (dist < 3) {
                    unit.hp -= 500;
                }
            });
            this.graphics.scene.remove(meteor);
        }, 500);
    }

    checkAetherWellControl() {
        let playerCount = 0;
        let enemyCount = 0;
        
        this.units.forEach(unit => {
            const dist = unit.mesh.position.distanceTo(new THREE.Vector3(0, 0, 0));
            if (dist < 2) {
                if (unit.isPlayer) playerCount++;
                else enemyCount++;
            }
        });

        if (playerCount > enemyCount) {
            this.manaRate = 0.02; // Double mana
            this.graphics.aetherWell.material.color.set(0x00ffff);
        } else if (enemyCount > playerCount) {
            this.manaRate = 0.005; // Slower mana
            this.graphics.aetherWell.material.color.set(0xff0000);
        } else {
            this.manaRate = 0.01;
            this.graphics.aetherWell.material.color.set(0xff00ff);
        }
    }
}
