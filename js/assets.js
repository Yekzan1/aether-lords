/**
 * AETHER LORDS - Assets Module
 * Contains card definitions, stats, and visual properties.
 */

export const Cards = [
    {
        id: 'titan_prime',
        name: 'Titan Prime',
        type: 'titan',
        cost: 7,
        hp: 2000,
        damage: 50,
        speed: 0.02,
        color: 0xffd700, // Gold
        description: 'Unique Hero. Can be upgraded with Aether.'
    },
    {
        id: 'void_rogue',
        name: 'Void Rogue',
        type: 'rogue',
        cost: 3,
        hp: 400,
        damage: 80,
        speed: 0.08,
        color: 0x8a2be2, // Purple
        description: 'Fast assassin. Jumps over obstacles.'
    },
    {
        id: 'void_mage',
        name: 'Void Mage',
        type: 'mage',
        cost: 4,
        hp: 600,
        damage: 30,
        speed: 0.03,
        color: 0x00ffff, // Cyan
        description: 'Pulls enemies together with Gravity.'
    },
    {
        id: 'aether_guard',
        name: 'Aether Guard',
        type: 'soldier',
        cost: 2,
        hp: 800,
        damage: 20,
        speed: 0.04,
        color: 0x00ff00, // Green
        description: 'Reliable frontline unit.'
    }
];

export const UI_CONFIG = {
    colors: {
        neonBlue: '#00ffff',
        neonPink: '#ff00ff',
        glassBackground: 'rgba(255, 255, 255, 0.1)'
    }
};
