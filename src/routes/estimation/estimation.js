import { v4 as uuidv4 } from 'uuid';

function generateRoomId() {
	const id = uuidv4();
	return id;
}

function connectToWebSocket(roomId, onMessageReceived) {
	let socket;
    const isDevelopment = import.meta.env.DEV;
	if (isDevelopment) {
		socket = new WebSocket(`ws://localhost:3000`);
	} else {
		socket = new WebSocket(`wss://estimationpoker.jcreek.co.uk`);
	}

	socket.addEventListener('open', () => {
		console.log(`Connected to WebSocket server from roomId: ${roomId}`);
	});

	socket.addEventListener('message', (event) => {
		const message = JSON.parse(event.data);
		onMessageReceived(message);
	});

	socket.addEventListener('close', () => {
		console.log('Disconnected from WebSocket server');
	});

	return socket;
}

function sendMessage(socket, message) {
	socket.send(JSON.stringify(message));
}

export { generateRoomId, connectToWebSocket, sendMessage };
