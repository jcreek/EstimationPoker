import { v4 as uuidv4 } from 'uuid';
import PartySocket from 'partysocket';
import { PUBLIC_PARTYKIT_HOST, PUBLIC_PARTYKIT_PARTY } from '$env/static/public';

function generateId() {
	const id = uuidv4();
	return id;
}

const partyHost = PUBLIC_PARTYKIT_HOST?.trim();
const partyName = PUBLIC_PARTYKIT_PARTY || 'main';

function getPartyKitHost() {
	if (partyHost) {
		return partyHost;
	}
	if (import.meta.env.DEV) {
		return 'localhost:1999';
	}
	throw new Error('PUBLIC_PARTYKIT_HOST is not set for this build.');
}

function connectToWebSocket(roomId, onMessageReceived) {
	const host = getPartyKitHost();
	const socket = new PartySocket({
		host,
		room: roomId ?? 'lobby',
		party: partyName,
		...(import.meta.env.DEV ? { protocol: 'ws' } : {})
	});

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
