import { v4 as uuidv4 } from 'uuid';

function generateId() {
	const id = uuidv4();
	return id;
}

function connectToWebSocket(roomId, onMessageReceived) {
	let socket;
    const isDevelopment = import.meta.env.DEV;
	if (isDevelopment) {
		socket = new WebSocket(`ws://localhost:8080`);
	} else {
		socket = new WebSocket(`wss://websocket.jcreek.co.uk`);
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
		alert('You have been disconnected from the server. Please refresh the page to reconnect.');
	});

	return socket;
}

function sendMessage(socket, message) {
	socket.send(JSON.stringify(message));
}

export { generateId, connectToWebSocket, sendMessage };
