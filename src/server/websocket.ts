import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { Room, cardSets } from './classes/Room.js';
import { User } from './classes/User.js';
import { JoinRoomMessage } from './classes/messages/JoinRoomMessage.js';
import { ChangeEstimateMessage } from './classes/messages/ChangeEstimateMessage.js';
import { SelectEstimateMessage } from './classes/messages/SelectEstimateMessage.js';

const app = express();
const port = process.env.PORT || 8080;

function onSocketPreError(e: Error) {
	console.log(e);
}

function onSocketPostError(e: Error) {
	console.log(e);
}

function groupEstimates(users: Array<User>) {
	let estimateGroups: { [key: number | string]: string[] } = {};
	users.forEach((user) => {
		if (user.estimate !== null) {
			if (estimateGroups[user.estimate]) {
				estimateGroups[user.estimate].push(user.name);
			} else {
				estimateGroups[user.estimate] = [user.name];
			}
		}
	});

	return estimateGroups;
}

console.log(`Attempting to run server on port ${port}`);

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const wss = new WebSocketServer({ noServer: true });
const rooms = new Set<Room>();

server.on('upgrade', (req, socket, head) => {
	socket.on('error', onSocketPreError);

	// perform auth
	if (!!req.headers['BadAuth']) {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
		socket.destroy();
		return;
	}

	wss.handleUpgrade(req, socket, head, (ws) => {
		socket.removeListener('error', onSocketPreError);
		wss.emit('connection', ws, req);
	});
});

wss.on('connection', (ws: WebSocket, req) => {
	let room: Room | null = null;

	ws.on('error', onSocketPostError);

	function createRoom(roomId: string, cardSetName: string) {
		room = new Room(roomId, cardSetName);
		rooms.add(room);
	}

	ws.on('message', (message) => {
		const data = JSON.parse(message.toString());

		if (data.type === 'create-room') {
			const roomId = data.roomId;
			const cardSetName = data.cardSetName;
			createRoom(roomId, cardSetName);
		} else if (data.type === 'join-room') {
			const joinRoomMessage: JoinRoomMessage = data as JoinRoomMessage;
			const { roomId, userId, name } = joinRoomMessage;
			room = getRoomById(roomId);

			// Create room if it doesn't already exist
			if (!room) {
				createRoom(roomId, data.cardSetName);
			}

			// Create the user in the room
			const user = new User(userId, name);
			room!.addUser(ws, user);

			broadcastToRoom(roomId, { type: 'user-joined', message: `${name} has joined the room` });
		} else if (data.type === 'select-estimate') {
			const selectEstimateMessage: SelectEstimateMessage = data as SelectEstimateMessage;
			const { userId, estimate } = selectEstimateMessage;

			if (room) {
				const user = room.getUserByWebSocket(ws);
				if (user) {
					user.estimate = estimate;
					broadcastToRoom(room.id, {
						type: 'estimate-selected',
						userId,
						name: user.name,
						estimate
					});

					const users = room.getUsers();
					let timeout = undefined;

					const allEstimates = room.getAllEstimates();
					if (allEstimates.size === users.length) {
						// If all users have estimated, clear the timeout
						clearTimeout(timeout);
						timeout = undefined;

						broadcastToRoom(room.id, {
							type: 'estimation-closed',
							groupedEstimates: groupEstimates(users)
						});
					} else if (allEstimates.size === users.length - 1) {
						// The last user has 30 seconds to add their estimation, otherwise send the nudge message
						let notEstimatedUser: User | undefined = undefined;
						for (let i = 0; i < users.length; i++) {
							if (!allEstimates.has(users[i].name)) {
								notEstimatedUser = users[i];
								break;
							}
						}
						if (notEstimatedUser !== undefined) {
							const ws = room.getWebSocketByUser(notEstimatedUser);
							if (ws) {
								// Cancel the old timeout if it's still running
								if (timeout) {
									clearTimeout(timeout);
								}
								// Set a new timeout
								timeout = setTimeout(() => {
									if (!room!.getAllEstimates().has(notEstimatedUser!.name)) {
										ws.send(JSON.stringify({ type: 'nudge' }));
									}
								}, 30000);
							}
						}
					}
				}
			}
		} else if (data.type === 'restart-estimation') {
			if (room) {
				room.clearEstimates();
				broadcastToRoom(room.id, { type: 'estimation-restarted' });
			}
		} else if (data.type === 'get-user-estimates') {
			if (room) {
				const users = room.getUsers();
				broadcastToRoom(room.id, { type: 'user-estimates', users, selectedCardSet: room.cardSet });
			}
		} else if (data.type === 'trigger-emoji') {
			const { cardId, emoji } = data;
			if (room) {
				broadcastToRoom(room.id, {
					type: 'trigger-emoji',
					cardId,
					emoji
				});
			}
		} else if (data.type === 'ping') {
			if (room) {
				broadcastToRoom(room.id, 'pong');
			}
		} else if (data.type === 'kick-user') {
			console.log('kick user message received');
			if (room) {
				const userIdToKick = data.userId;

				const ws = room.getWebSocketByUserId(userIdToKick);
				console.log(userIdToKick, ws);
				if (ws) {
					console.log('closing ws');
					ws.close();
				}

				// Remove them from the room even if the active websocket can't be found or can't be closed
				room.removeUser(userIdToKick);
			}
		}
	});

	ws.on('close', () => {
		if (room) {
			const user = room.getUserByWebSocket(ws);
			if (user) {
				room.removeUser(ws);

				if (room.getUsers().length === 0) {
					rooms.delete(room);
					broadcastToRoom(room.id, {
						type: 'room-deleted',
						message: 'Room deleted'
					});
				}

				broadcastToRoom(room.id, {
					type: 'user-left',
					userId: user.userId
				});
			}
		}
	});
});

function broadcastToRoom(roomId: string, message: any) {
	const room = getRoomById(roomId);
	if (room) {
		room.broadcast(message);
	}
}

function getUsersInRoom(roomId: string) {
	const room = getRoomById(roomId);
	if (room) {
		return room.getUsers();
	}
	return [];
}

function getRoomById(roomId: string) {
	for (const room of rooms) {
		if (room.id === roomId) {
			return room;
		}
	}
	return null;
}
