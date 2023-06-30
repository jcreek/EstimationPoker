import { v4 as uuidv4 } from 'uuid';

function generateRoomID() {
	const id = uuidv4();
	return id;
}

function connectToWebSocket(roomID, onMessageReceived) {
    const socketPath = `.netlify/functions/websocket`;
	let socket = new WebSocket(`wss://estimationpoker.jcreek.co.uk/${socketPath}`);
	
    // const isDevelopment = import.meta.env.DEV;
	// if (isDevelopment) {
	// 	socket = new WebSocket(`wss://localhost:4173/${socketPath}`);
	// } else {
	// 	socket = new WebSocket(`wss://estimationpoker.jcreek.co.uk/${socketPath}`);
	// }

	socket.addEventListener('open', () => {
		console.log(`Connected to WebSocket server from roomID: ${roomId}`);
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

export { generateRoomID, connectToWebSocket, sendMessage };
