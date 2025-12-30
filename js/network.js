/**
 * AETHER LORDS - Network Module
 * Handles Gun.js + SEA for authentication and P2P synchronization.
 */

// Gun.js is loaded via CDN in index.html, so we access it globally
const gun = Gun(['https://gun-manchester-gb.herokuapp.com/gun', 'https://gun-us.herokuapp.com/gun']);
const user = gun.user().recall({sessionStorage: true});

export const Network = {
    gun,
    user,

    /**
     * Authenticate or Create User
     * @param {string} email 
     * @param {string} pass 
     * @returns {Promise}
     */
    async auth(email, pass) {
        return new Promise((resolve, reject) => {
            user.auth(email, pass, (ack) => {
                if (ack.err) {
                    // If auth fails, try creating the user
                    user.create(email, pass, (createAck) => {
                        if (createAck.err) {
                            reject(createAck.err);
                        } else {
                            // After creation, auth again
                            user.auth(email, pass, (authAck) => {
                                if (authAck.err) reject(authAck.err);
                                else {
                                    this.initUserData();
                                    resolve(authAck);
                                }
                            });
                        }
                    });
                } else {
                    resolve(ack);
                }
            });
        });
    },

    /**
     * Initialize default user data if it doesn't exist
     */
    initUserData() {
        user.get('gamedata').once((data) => {
            if (!data) {
                user.get('gamedata').put({
                    trophies: 0,
                    level: 1,
                    starterDeck: true,
                    lastLogin: Date.now()
                });
            }
        });
    },

    /**
     * Matchmaking logic
     * @param {Function} onMatchFound 
     */
    findMatch(onMatchFound) {
        const matchmaking = gun.get('aether_matchmaking');
        const myId = user.is.pub;

        // Register self in matchmaking
        matchmaking.get(myId).put({
            status: 'searching',
            timestamp: Date.now(),
            username: user.is.alias
        });

        // Listen for other players
        matchmaking.map().once((peer, peerId) => {
            if (peerId !== myId && peer.status === 'searching') {
                // Simple logic: first one found is the opponent
                onMatchFound({
                    id: peerId,
                    name: peer.username
                });
                
                // Update status to matched
                matchmaking.get(myId).put({ status: 'matched', opponent: peerId });
            }
        });
    },

    /**
     * Sync game state (Position, Health, etc.)
     * @param {string} gameId 
     * @param {Object} state 
     */
    syncGameState(gameId, state) {
        gun.get('games').get(gameId).put(state);
    },

    /**
     * Listen for game state updates
     * @param {string} gameId 
     * @param {Function} callback 
     */
    onGameStateUpdate(gameId, callback) {
        gun.get('games').get(gameId).on(callback);
    }
};
