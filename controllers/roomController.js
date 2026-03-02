import crypto from "crypto";

const rooms = new Map();

function generateRoomId() {
    return crypto.randomBytes(3).toString('hex');
}

export const createRoom = (req, res) => {
    const { private: isPrivate, duration, mode, ball } = req.body;
    
    const roomId = generateRoomId();
    
    const roomData = {
        id: roomId,
        private: isPrivate === 'on',
        duration: parseInt(duration) || 120,
        mode: mode || '1vs1',
        ball: ball || 'texture-1',
        createdAt: Date.now(),
        players: [],
        gameState: null
    };
    
    rooms.set(roomId, roomData);
    
    res.redirect(`/room/${roomId}`);
};

export const getRoom = (req, res) => {
    const { id } = req.params;
    
    if (!rooms.has(id)) {
        return res.status(404).render('error', { 
            title: 'Sala no encontrada',
            message: 'La sala que buscas no existe o ha expirado.',
            error: { status: 404 }
        });
    }
    
    const room = rooms.get(id);
    
    res.render('room', { 
        title: `Sala ${id}`,
        user: req.user,
        room: room
    });
};

export const getRoomData = (roomId) => {
    return rooms.get(roomId);
};

export const deleteRoom = (roomId) => {
    rooms.delete(roomId);
};

export const updateRoomPlayers = (roomId, players) => {
    const room = rooms.get(roomId);
    if (room) {
        room.players = players;
        rooms.set(roomId, room);
    }
};

export const updateRoomGameState = (roomId, gameState) => {
    const room = rooms.get(roomId);
    if (room) {
        room.gameState = gameState;
        rooms.set(roomId, room);
    }
};
