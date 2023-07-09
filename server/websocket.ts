import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const port = process.env.PORT || 3000;

const clients = new Map();
const estimates = new Map();

function onSocketPreError(e: Error) {
	console.log(e);
}

function onSocketPostError(e: Error) {
	console.log(e);
}

console.log(`Attempting to run server on port ${port}`);

const s = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

const wss = new WebSocketServer({ noServer: true });

s.on('upgrade', (req, socket, head) => {
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

wss.on('connection', (ws, req) => {
	ws.on('error', onSocketPostError);

	let roomId: string;

	ws.on('message', (message) => {
		const data = JSON.parse(message.toString());

		if (data.type === 'join-room') {
			roomId = data.roomId;
			clients.set(ws, roomId);
			broadcast(roomId, { type: 'user-joined', message: 'A new user has joined the room' });
		} else if (data.type === 'select-estimate') {
			const { user, estimate } = data;

			if (!estimates.has(roomId)) {
				estimates.set(roomId, new Map());
			}
			estimates.get(roomId).set(user, estimate);

			broadcast(roomId, { type: 'estimate-selected', user, estimate });

			// Check if all users have selected an estimate
			if (estimates.get(roomId).size === clientsInRoom(roomId).length) {
				broadcast(roomId, { type: 'estimation-closed', message: 'Estimation closed' });
			}
		} else if (data.type === 'change-estimate') {
			const { user, estimate } = data;

			if (estimates.has(roomId)) {
				estimates.get(roomId).set(user, estimate);
				broadcast(roomId, { type: 'estimate-changed', user, estimate });
			}
		}
	});

	ws.on('close', () => {
		const user = clients.get(ws);
		clients.delete(ws);

		if (estimates.has(roomId)) {
			estimates.get(roomId).delete(user);

			if (estimates.get(roomId).size === 0) {
				estimates.delete(roomId);
				broadcast(roomId, { type: 'estimation-started', message: 'Estimation started again' });
			}
		}

		broadcast(roomId, { type: 'user-left', message: `${user} has left the room` });
	});
});

function broadcast(roomId: string, message: any) {
	wss.clients.forEach((client) => {
		if (clients.get(client) === roomId && client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(message));
		}
	});
}

function clientsInRoom(roomId: string) {
	return [...clients.values()].filter((id) => id === roomId);
}
