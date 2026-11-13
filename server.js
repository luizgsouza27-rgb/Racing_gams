/**
 * Retro Racing - Standalone WebSocket Server (Node.js native)
 * Supports up to 10 players per room, real-time telemetry, matchmaking,
 * client-side prediction + interpolation support, and synchronized podium results.
 */

const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 8080;
const TICK_RATE = 30; // 30Hz broadcast for ultra-smooth racing
const TICK_MS = Math.floor(1000 / TICK_RATE);

// Rooms storage: { [roomCode]: Room }
const rooms = new Map();

// Helper to generate 4-character room codes (e.g., RETRO, GP99, FAST)
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return rooms.has(code) ? generateRoomCode() : code;
}

// WebSocket Frame Parser & Serializer (RFC 6455)
function parseWebSocketFrame(buffer) {
    if (buffer.length < 2) return null;
    const firstByte = buffer[0];
    const secondByte = buffer[1];
    const opcode = firstByte & 0x0f;
    const isMasked = (secondByte & 0x80) !== 0;
    let payloadLen = secondByte & 0x7f;
    let offset = 2;

    if (payloadLen === 126) {
        if (buffer.length < 4) return null;
        payloadLen = buffer.readUInt16BE(2);
        offset = 4;
    } else if (payloadLen === 127) {
        if (buffer.length < 10) return null;
        payloadLen = Number(buffer.readBigUInt64BE(2));
        offset = 10;
    }

    let maskKey = null;
    if (isMasked) {
        if (buffer.length < offset + 4) return null;
        maskKey = buffer.slice(offset, offset + 4);
        offset += 4;
    }

    if (buffer.length < offset + payloadLen) return null;
    const payload = buffer.slice(offset, offset + payloadLen);

    if (isMasked && maskKey) {
        for (let i = 0; i < payload.length; i++) {
            payload[i] ^= maskKey[i % 4];
        }
    }

    return { opcode, payload, totalLength: offset + payloadLen };
}

function makeWebSocketFrame(data, opcode = 0x01) {
    const payload = Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'utf8');
    const length = payload.length;
    let header;

    if (length < 126) {
        header = Buffer.alloc(2);
        header[0] = 0x80 | (opcode & 0x0f);
        header[1] = length;
    } else if (length <= 0xffff) {
        header = Buffer.alloc(4);
        header[0] = 0x80 | (opcode & 0x0f);
        header[1] = 126;
        header.writeUInt16BE(length, 2);
    } else {
        header = Buffer.alloc(10);
        header[0] = 0x80 | (opcode & 0x0f);
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(length), 2);
    }

    return Buffer.concat([header, payload]);
}

// Connection Wrapper
class ClientConnection {
    constructor(socket) {
        this.socket = socket;
        this.id = 'p_' + Math.random().toString(36).substring(2, 9);
        this.name = 'Piloto ' + Math.floor(Math.random() * 90 + 10);
        this.roomCode = null;
        this.ready = false;
        this.isHost = false;
        this.buffer = Buffer.alloc(0);
        this.alive = true;

        // Player custom garage config & vehicle type
        this.garage = {
            body: '#e10600',
            trim: '#f8fafc',
            helmet: '#ffcc00',
            number: '7',
            decal: 'RETRO',
            wing: 'standard',
            wheels: 'dark',
            series: 'F1',
            model: 'F1'
        };

        // Realtime racing telemetry
        this.telemetry = {
            x: 0,
            z: 0,
            speed: 0,
            slideX: 0,
            gear: '1',
            lap: 1,
            lapTime: 0,
            totalTime: 0,
            finished: false,
            finishRank: null,
            finishTime: 0,
            inPit: false,
            isDrifting: false,
            timestamp: Date.now()
        };

        this.setupSocket();
    }

    setupSocket() {
        this.socket.on('data', (chunk) => {
            this.buffer = Buffer.concat([this.buffer, chunk]);
            while (this.buffer.length > 0) {
                const parsed = parseWebSocketFrame(this.buffer);
                if (!parsed) break;
                this.buffer = this.buffer.slice(parsed.totalLength);

                if (parsed.opcode === 0x08) { // Close
                    this.close();
                    break;
                } else if (parsed.opcode === 0x09) { // Ping -> Pong
                    this.socket.write(makeWebSocketFrame(parsed.payload, 0x0a));
                } else if (parsed.opcode === 0x01) { // Text JSON
                    try {
                        const msg = JSON.parse(parsed.payload.toString('utf8'));
                        handleClientMessage(this, msg);
                    } catch (err) {
                        console.error('Invalid message from client:', err.message);
                    }
                }
            }
        });

        this.socket.on('error', (err) => {
            console.log(`Socket error (${this.id}):`, err.message);
            this.cleanup();
        });

        this.socket.on('close', () => {
            this.cleanup();
        });
    }

    send(msgObj) {
        if (this.socket.destroyed || !this.socket.writable) return;
        try {
            const json = JSON.stringify(msgObj);
            this.socket.write(makeWebSocketFrame(json));
        } catch (e) {
            console.error('Send error:', e.message);
        }
    }

    close() {
        if (!this.socket.destroyed) {
            try {
                this.socket.write(makeWebSocketFrame(Buffer.alloc(0), 0x08));
                this.socket.end();
            } catch (e) {}
        }
        this.cleanup();
    }

    cleanup() {
        if (!this.alive) return;
        this.alive = false;
        leaveCurrentRoom(this);
    }
}

// Room Management
class Room {
    constructor(code, name, privacy, host) {
        this.code = code;
        this.name = name || ('Sala ' + code);
        this.privacy = privacy || 'public'; // 'public' | 'private'
        this.hostId = host.id;
        this.stage = 0; // Stage index
        this.series = 'F1';
        this.state = 'LOBBY'; // 'LOBBY' | 'STARTING' | 'RACING' | 'FINISHED'
        this.players = new Map(); // id -> ClientConnection
        this.finishOrder = [];
        this.totalLaps = 3;
        this.trackLength = 120000;
        this.addPlayer(host, true);
    }

    addPlayer(client, isHost = false) {
        if (this.players.size >= 10) return false;
        client.roomCode = this.code;
        client.isHost = isHost;
        client.ready = isHost; // Host auto-readies
        client.telemetry.finished = false;
        client.telemetry.finishRank = null;
        this.players.set(client.id, client);
        this.broadcastLobbyState();
        return true;
    }

    removePlayer(client) {
        this.players.delete(client.id);
        client.roomCode = null;
        client.isHost = false;

        if (this.players.size === 0) {
            rooms.delete(this.code);
            return;
        }

        // Migrate host if current host left
        if (this.hostId === client.id) {
            const nextHost = Array.from(this.players.values())[0];
            if (nextHost) {
                this.hostId = nextHost.id;
                nextHost.isHost = true;
                nextHost.ready = true;
            }
        }

        this.broadcastLobbyState();
        this.checkRaceCompletion();
    }

    broadcast(msg, exceptId = null) {
        for (const [id, player] of this.players) {
            if (id !== exceptId) {
                player.send(msg);
            }
        }
    }

    broadcastLobbyState() {
        const playerList = Array.from(this.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            ready: p.ready,
            isHost: p.id === this.hostId,
            garage: p.garage
        }));

        this.broadcast({
            type: 'LOBBY_STATE',
            roomCode: this.code,
            roomName: this.name,
            privacy: this.privacy,
            hostId: this.hostId,
            state: this.state,
            stage: this.stage,
            series: this.series,
            totalLaps: this.totalLaps,
            playerCount: this.players.size,
            players: playerList
        });
    }

    broadcastTelemetry() {
        if (this.state !== 'RACING' && this.state !== 'STARTING') return;

        // Rank players by lap + distance
        const ranked = Array.from(this.players.values()).map(p => {
            const totalDist = ((p.telemetry.lap - 1) * this.trackLength) + p.telemetry.z;
            return {
                id: p.id,
                name: p.name,
                x: p.telemetry.x,
                z: p.telemetry.z,
                speed: p.telemetry.speed,
                slideX: p.telemetry.slideX,
                gear: p.telemetry.gear,
                lap: p.telemetry.lap,
                inPit: p.telemetry.inPit,
                isDrifting: p.telemetry.isDrifting,
                finished: p.telemetry.finished,
                finishRank: p.telemetry.finishRank,
                finishTime: p.telemetry.finishTime,
                totalDist: totalDist,
                timestamp: p.telemetry.timestamp
            };
        });

        // Sort: finished players keep their finishRank; active players ranked by total distance descending
        ranked.sort((a, b) => {
            if (a.finished && b.finished) return (a.finishRank || 99) - (b.finishRank || 99);
            if (a.finished) return -1;
            if (b.finished) return 1;
            return b.totalDist - a.totalDist;
        });

        const livePositions = {};
        ranked.forEach((r, idx) => {
            livePositions[r.id] = r.finished ? (r.finishRank || (idx + 1)) : (idx + 1);
        });

        this.broadcast({
            type: 'RACE_TICK',
            timestamp: Date.now(),
            racers: ranked,
            positions: livePositions
        });
    }

    checkRaceCompletion() {
        if (this.state !== 'RACING') return;
        const allFinished = Array.from(this.players.values()).every(p => p.telemetry.finished);
        if (allFinished && this.players.size > 0) {
            this.state = 'FINISHED';
            this.broadcast({
                type: 'RACE_FINISHED_ALL',
                finishOrder: this.finishOrder
            });
        }
    }
}

function leaveCurrentRoom(client) {
    if (!client.roomCode) return;
    const room = rooms.get(client.roomCode);
    if (room) {
        room.removePlayer(client);
    }
}

function handleClientMessage(client, msg) {
    switch (msg.type) {
        case 'LIST_ROOMS': {
            const list = [];
            for (const [code, r] of rooms) {
                if (r.privacy === 'public' && r.state === 'LOBBY' && r.players.size < 10) {
                    list.push({
                        code: r.code,
                        name: r.name,
                        playerCount: r.players.size,
                        maxPlayers: 10,
                        stage: r.stage,
                        series: r.series
                    });
                }
            }
            client.send({ type: 'ROOM_LIST', rooms: list });
            break;
        }

        case 'CREATE_ROOM': {
            leaveCurrentRoom(client);
            if (msg.name) client.name = String(msg.name).trim().substring(0, 16) || client.name;
            if (msg.garage) Object.assign(client.garage, msg.garage);

            const code = generateRoomCode();
            const room = new Room(code, msg.roomName, msg.privacy, client);
            if (msg.stage !== undefined) room.stage = Number(msg.stage) || 0;
            if (msg.series) room.series = msg.series;
            if (msg.totalLaps) room.totalLaps = Number(msg.totalLaps) || 3;
            if (msg.trackLength) room.trackLength = Number(msg.trackLength) || 120000;

            rooms.set(code, room);
            client.send({ type: 'ROOM_CREATED', roomCode: code, isHost: true });
            room.broadcastLobbyState();
            console.log(`[Multiplayer] Room created: ${code} by ${client.name}`);
            break;
        }

        case 'JOIN_ROOM': {
            leaveCurrentRoom(client);
            const code = (msg.roomCode || '').trim().toUpperCase();
            const room = rooms.get(code);

            if (!room) {
                client.send({ type: 'ERROR', message: 'Sala não encontrada com o código ' + code });
                return;
            }
            if (room.players.size >= 10) {
                client.send({ type: 'ERROR', message: 'Sala cheia (limite de 10 pilotos atingido).' });
                return;
            }
            if (room.state !== 'LOBBY') {
                client.send({ type: 'ERROR', message: 'Esta corrida já está em andamento.' });
                return;
            }

            if (msg.name) client.name = String(msg.name).trim().substring(0, 16) || client.name;
            if (msg.garage) Object.assign(client.garage, msg.garage);

            const added = room.addPlayer(client, false);
            if (added) {
                client.send({ type: 'ROOM_JOINED', roomCode: code, isHost: false });
                console.log(`[Multiplayer] ${client.name} joined room ${code}`);
            }
            break;
        }

        case 'UPDATE_PROFILE': {
            if (msg.name) client.name = String(msg.name).trim().substring(0, 16);
            if (msg.garage) Object.assign(client.garage, msg.garage);

            if (client.roomCode) {
                const room = rooms.get(client.roomCode);
                if (room) room.broadcastLobbyState();
            }
            break;
        }

        case 'TOGGLE_READY': {
            if (!client.roomCode) return;
            const room = rooms.get(client.roomCode);
            if (!room) return;

            client.ready = typeof msg.ready === 'boolean' ? msg.ready : !client.ready;
            room.broadcastLobbyState();
            break;
        }

        case 'HOST_CONFIG': {
            if (!client.roomCode || !client.isHost) return;
            const room = rooms.get(client.roomCode);
            if (!room) return;

            if (msg.stage !== undefined) room.stage = Number(msg.stage) || 0;
            if (msg.series) room.series = msg.series;
            if (msg.totalLaps) room.totalLaps = Number(msg.totalLaps) || 3;
            if (msg.trackLength) room.trackLength = Number(msg.trackLength) || 120000;
            room.broadcastLobbyState();
            break;
        }

        case 'START_RACE_REQUEST': {
            if (!client.roomCode || !client.isHost) {
                client.send({ type: 'ERROR', message: 'Apenas o anfitrião pode iniciar a corrida.' });
                return;
            }
            const room = rooms.get(client.roomCode);
            if (!room) return;

            const allReady = Array.from(room.players.values()).every(p => p.ready);
            if (!allReady) {
                client.send({ type: 'ERROR', message: 'Aguarde todos os pilotos estarem PRONTOS antes de iniciar.' });
                return;
            }

            room.state = 'STARTING';
            room.finishOrder = [];

            // Assign starting grid positions (0 to 9)
            const playerArray = Array.from(room.players.values());
            playerArray.forEach((p, idx) => {
                p.telemetry.lap = 1;
                p.telemetry.speed = 0;
                p.telemetry.finished = false;
                p.telemetry.finishRank = null;
                p.telemetry.finishTime = 0;
                // Grid slots: alternate left (-0.38) and right (0.38), staggered along Z
                p.telemetry.x = (idx % 2 === 0) ? -0.38 : 0.38;
                p.telemetry.gridSlot = idx;
            });

            room.broadcast({
                type: 'RACE_START_COUNTDOWN',
                stage: room.stage,
                series: room.series,
                totalLaps: room.totalLaps,
                countdownSeconds: 3,
                grid: playerArray.map(p => ({
                    id: p.id,
                    name: p.name,
                    slot: p.telemetry.gridSlot,
                    garage: p.garage
                }))
            });

            // After countdown completes, race transitions to RACING
            setTimeout(() => {
                if (room.state === 'STARTING') {
                    room.state = 'RACING';
                    room.broadcast({ type: 'RACE_GO' });
                }
            }, 3000);
            break;
        }

        case 'PLAYER_TELEMETRY': {
            if (!client.roomCode) return;
            const room = rooms.get(client.roomCode);
            if (!room) return;

            // Merge telemetry
            client.telemetry.x = Number(msg.x) || 0;
            client.telemetry.z = Number(msg.z) || 0;
            client.telemetry.speed = Number(msg.speed) || 0;
            client.telemetry.slideX = Number(msg.slideX) || 0;
            client.telemetry.gear = String(msg.gear || '1');
            client.telemetry.lap = Number(msg.lap) || client.telemetry.lap;
            client.telemetry.inPit = !!msg.inPit;
            client.telemetry.isDrifting = !!msg.isDrifting;
            client.telemetry.timestamp = Date.now();
            break;
        }

        case 'COLLISION_EVENT': {
            // Forward collision sparks / bump response to the impacted opponent
            if (!client.roomCode || !msg.targetId) return;
            const room = rooms.get(client.roomCode);
            if (!room) return;
            const target = room.players.get(msg.targetId);
            if (target) {
                target.send({
                    type: 'COLLISION_IMPACT',
                    fromId: client.id,
                    fromName: client.name,
                    impactX: msg.impactX,
                    intensity: msg.intensity || 1.0
                });
            }
            break;
        }

        case 'PLAYER_FINISHED': {
            if (!client.roomCode) return;
            const room = rooms.get(client.roomCode);
            if (!room) return;

            if (!client.telemetry.finished) {
                client.telemetry.finished = true;
                client.telemetry.finishTime = Number(msg.finishTime) || 0;
                room.finishOrder.push({
                    id: client.id,
                    name: client.name,
                    time: client.telemetry.finishTime,
                    garage: client.garage
                });
                const rank = room.finishOrder.length;
                client.telemetry.finishRank = rank;

                // Notify all players about who finished and their rank
                room.broadcast({
                    type: 'PLAYER_CROSSED_FINISH',
                    id: client.id,
                    name: client.name,
                    rank: rank,
                    time: client.telemetry.finishTime
                });

                room.checkRaceCompletion();
            }
            break;
        }

        case 'LEAVE_ROOM': {
            leaveCurrentRoom(client);
            client.send({ type: 'ROOM_LEFT' });
            break;
        }
    }
}

// 30Hz Broadcast Tick Loop for all active racing rooms
setInterval(() => {
    for (const [, room] of rooms) {
        room.broadcastTelemetry();
    }
}, TICK_MS);

// HTTP / WebSocket Handshake Server
const server = http.createServer((req, res) => {
    // Health / Status endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/status' || req.url === '/api/rooms') {
        const publicRooms = [];
        for (const [code, r] of rooms) {
            publicRooms.push({
                code: r.code,
                name: r.name,
                players: r.players.size,
                max: 10,
                state: r.state,
                series: r.series
            });
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            service: 'Retro Racing Multiplayer Engine',
            activeRooms: rooms.size,
            rooms: publicRooms
        }));
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🏎️ Servidor WebSocket de Retro Racing Online ativo na porta ' + PORT + '!\nConecte via ws://localhost:' + PORT);
});

server.on('upgrade', (req, socket, head) => {
    const key = req.headers['sec-websocket-key'];
    if (!key) {
        socket.destroy();
        return;
    }

    const accept = crypto
        .createHash('sha1')
        .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        .digest('base64');

    socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        'Sec-WebSocket-Accept: ' + accept + '\r\n\r\n'
    );

    new ClientConnection(socket);
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🏎️ RETRO RACING - SERVIDOR MULTIPLAYER (10 PILOTOS)`);
    console.log(`📡 WebSocket ativo na porta ${PORT}`);
    console.log(`⚡ Taxa de Transmissão: ${TICK_RATE}Hz (${TICK_MS}ms)`);
    console.log(`🌐 Status HTTP: http://localhost:${PORT}/status`);
    console.log(`====================================================`);
});
