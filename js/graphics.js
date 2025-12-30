/**
 * AETHER LORDS - Graphics Module
 * Handles Three.js scene, lighting, bloom, and particles.
 */

import * as THREE from 'https://cdn.skypack.dev/three@0.160.0';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.skypack.dev/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

export class Graphics {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        document.body.appendChild(this.renderer.domElement);

        // Camera position for RTS view
        this.camera.position.set(0, 15, 10);
        this.camera.lookAt(0, 0, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x00ffff, 1);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        // Post-processing (Bloom)
        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        bloomPass.threshold = 0.2;
        bloomPass.strength = 1.2;
        bloomPass.radius = 0.5;

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);

        // Arena Creation
        this.createArena();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    createArena() {
        // Floating Arena
        const geometry = new THREE.CylinderGeometry(10, 12, 1, 32);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x111122, 
            metalness: 0.8, 
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        const arena = new THREE.Mesh(geometry, material);
        arena.position.y = -0.5;
        this.scene.add(arena);

        // Neon Grid
        const grid = new THREE.GridHelper(20, 20, 0x00ffff, 0x004444);
        grid.position.y = 0.01;
        this.scene.add(grid);

        // Aether Well (Center)
        const wellGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 100);
        const wellMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const well = new THREE.Mesh(wellGeo, wellMat);
        well.rotation.x = Math.PI / 2;
        well.position.y = 0.1;
        this.scene.add(well);
        this.aetherWell = well;
    }

    createUnit(type, color, position) {
        let geometry;
        if (type === 'titan') geometry = new THREE.CapsuleGeometry(0.6, 1, 4, 8);
        else if (type === 'rogue') geometry = new THREE.ConeGeometry(0.4, 1, 8);
        else geometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);

        const material = new THREE.MeshStandardMaterial({ 
            color: color, 
            emissive: color, 
            emissiveIntensity: 0.5 
        });
        const unit = new THREE.Mesh(geometry, material);
        unit.position.copy(position);
        unit.position.y = 0.5;
        this.scene.add(unit);
        return unit;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        if (this.aetherWell) {
            this.aetherWell.rotation.z += 0.02;
        }
        this.composer.render();
    }
}
