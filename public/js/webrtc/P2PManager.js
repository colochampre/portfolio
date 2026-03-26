// P2P Manager - Coordinates P2P connections for a room
// Determines if current player is host or client and manages accordingly

import { HostGame } from './HostGame.js';
import { ClientGame } from './ClientGame.js';

export class P2PManager {
    constructor(socket, roomId, roomConfig) {
        this.socket = socket;
        this.roomId = roomId;
        this.roomConfig = roomConfig;
        this.isHost = false;
        this.hostId = null;
        this.game = null; // HostGame or ClientGame
        this.lobbyPlayers = [];
        this.latency = 0;

        // Callbacks
        this.onGameUpdate = null;
        this.onSoundEvents = null;
        this.onGameOver = null;
        this.onKickoffCountdown = null;
        this.onLatencyUpdate = null;
        this.onGameStarting = null;
    }

    // Called when room-joined is received
    initialize(players, myPlayerId) {
        this.lobbyPlayers = players;
        
        // First player in the room is the host
        if (players.length > 0 && players[0].id === myPlayerId) {
            this.isHost = true;
            this.hostId = myPlayerId;
        } else if (players.length > 0) {
            this.isHost = false;
            this.hostId = players[0].id;
        }
    }

    updatePlayers(players) {
        this.lobbyPlayers = players;
        
        // Update HostGame's lobbyPlayers if we're the host
        if (this.isHost && this.game) {
            this.game.lobbyPlayers = players;
        }
        
        // Update host if first player changed
        if (players.length > 0) {
            const newHostId = players[0].id;
            if (newHostId !== this.hostId) {
                this.hostId = newHostId;
                this.isHost = (newHostId === this.socket.id);
            }
        }
    }

    // Start P2P game (called when all players are ready)
    startGame() {
        if (this.isHost) {
            this._startAsHost();
        } else {
            this._startAsClient();
        }
    }

    _startAsHost() {
        
        this.game = new HostGame(
            this.socket,
            this.roomId,
            this.roomConfig,
            this.lobbyPlayers
        );

        // Wire up callbacks
        this.game.onGameUpdate = (state) => this.onGameUpdate?.(state);
        this.game.onSoundEvents = (events) => this.onSoundEvents?.(events);
        this.game.onGameOver = (data) => this.onGameOver?.(data);
        this.game.onKickoffCountdown = (count) => this.onKickoffCountdown?.(count);
        this.game.onLatencyUpdate = (peerId, latency) => {
            // For host, we track latency to each peer
            this.onLatencyUpdate?.(latency);
        };

        // Initialize game state
        this.game.initializeGame();

        // Emit game-starting BEFORE start() so canvas renders during countdown
        this.onGameStarting?.({
            canvasWidth: this.game.gameState.canvasWidth,
            canvasHeight: this.game.gameState.canvasHeight,
            mode: this.game.gameState.mode
        });

        // Now start the game (runs pre-game countdown)
        this.game.start();
    }

    _startAsClient() {
        this.game = new ClientGame(
            this.socket,
            this.roomId,
            this.hostId
        );

        // Wire up callbacks BEFORE connecting
        this.game.onGameUpdate = (state) => {
            this.onGameUpdate?.(state);
        };
        this.game.onSoundEvents = (events) => this.onSoundEvents?.(events);
        this.game.onGameOver = (data) => this.onGameOver?.(data);
        this.game.onKickoffCountdown = (count) => this.onKickoffCountdown?.(count);
        this.game.onLatencyUpdate = (latency) => {
            this.latency = latency;
            this.onLatencyUpdate?.(latency);
        };
        this.game.onGameStarting = (data) => this.onGameStarting?.(data);

        // Now connect to host
        this.game.connect();
    }

    // Handle local player input
    handleInput(direction) {
        if (!this.game) return;

        if (this.isHost) {
            this.game.handleLocalInput(direction);
        } else {
            this.game.sendInput(direction);
        }
    }

    getLatency() {
        if (this.isHost) {
            return 0; // Host has 0 latency to itself
        }
        return this.game?.getLatency() || 0;
    }

    isP2PActive() {
        if (this.isHost) {
            return this.game !== null;
        }
        return this.game?.isP2PConnected() || false;
    }

    destroy() {
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }
    }
}
