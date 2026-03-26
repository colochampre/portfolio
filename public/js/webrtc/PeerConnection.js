// WebRTC Peer Connection Manager
// Handles P2P connections between players

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
];

export class PeerConnection {
    constructor(socket, peerId, isInitiator) {
        this.socket = socket;
        this.peerId = peerId;
        this.isInitiator = isInitiator;
        this.dataChannel = null;
        this.pc = null;
        this.isConnected = false;
        this.pingInterval = null;
        this.lastPingTime = 0;
        this.latency = 0;

        // Callbacks
        this.onMessage = null;
        this.onConnected = null;
        this.onDisconnected = null;
        this.onLatencyUpdate = null;
        this.onDataChannelOpen = null;

        this._createPeerConnection();
    }

    _createPeerConnection() {
        this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.socket.emit('rtc-ice-candidate', {
                    targetId: this.peerId,
                    candidate: event.candidate
                });
            }
        };

        this.pc.onconnectionstatechange = () => {
            if (this.pc.connectionState === 'connected') {
                this.isConnected = true;
                this._startPingLoop();
                this.onConnected?.();
            } else if (this.pc.connectionState === 'disconnected' || 
                       this.pc.connectionState === 'failed' ||
                       this.pc.connectionState === 'closed') {
                this.isConnected = false;
                this._stopPingLoop();
                this.onDisconnected?.();
            }
        };

        this.pc.oniceconnectionstatechange = () => {};

        if (this.isInitiator) {
            // Host creates the data channel
            this.dataChannel = this.pc.createDataChannel('game', {
                ordered: false,
                maxRetransmits: 0
            });
            this._setupDataChannel();
        } else {
            // Client waits for data channel
            this.pc.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this._setupDataChannel();
            };
        }
    }

    _setupDataChannel() {
        this.dataChannel.onopen = () => {
            this.onDataChannelOpen?.();
        };

        this.dataChannel.onclose = () => {};

        this.dataChannel.onerror = (error) => {
            console.error(`[P2P] DataChannel error:`, error);
        };

        this.dataChannel.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Handle ping/pong internally
                if (data.type === 'ping') {
                    this.send({ type: 'pong', timestamp: data.timestamp });
                    return;
                }
                if (data.type === 'pong') {
                    this.latency = Math.round((performance.now() - data.timestamp) / 2);
                    this.onLatencyUpdate?.(this.latency);
                    return;
                }

                this.onMessage?.(data);
            } catch (e) {
                console.error('[P2P] Failed to parse message:', e);
            }
        };
    }

    _startPingLoop() {
        this._stopPingLoop();
        this.pingInterval = setInterval(() => {
            if (this.isConnected && this.dataChannel?.readyState === 'open') {
                this.send({ type: 'ping', timestamp: performance.now() });
            }
        }, 1000);
    }

    _stopPingLoop() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    async createOffer() {
        try {
            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);
            this.socket.emit('rtc-offer', {
                targetId: this.peerId,
                offer: this.pc.localDescription
            });
        } catch (e) {
            console.error('[P2P] Failed to create offer:', e);
        }
    }

    async handleOffer(offer) {
        try {
            await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            this.socket.emit('rtc-answer', {
                targetId: this.peerId,
                answer: this.pc.localDescription
            });
        } catch (e) {
            console.error('[P2P] Failed to handle offer:', e);
        }
    }

    async handleAnswer(answer) {
        try {
            await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (e) {
            console.error('[P2P] Failed to handle answer:', e);
        }
    }

    async handleIceCandidate(candidate) {
        try {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
            console.error('[P2P] Failed to add ICE candidate:', e);
        }
    }

    send(data) {
        if (this.dataChannel?.readyState === 'open') {
            this.dataChannel.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    getLatency() {
        return this.latency;
    }

    close() {
        this._stopPingLoop();
        if (this.dataChannel) {
            this.dataChannel.close();
            this.dataChannel = null;
        }
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }
        this.isConnected = false;
    }
}
