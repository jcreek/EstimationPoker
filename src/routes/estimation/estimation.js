import { v4 as uuidv4 } from 'uuid';
import PartySocket from 'partysocket';
import { env } from '$env/dynamic/public';

function generateId() {
	const id = uuidv4();
	return id;
}

const fallbackHost = import.meta.env.DEV
	? 'localhost:1999'
	: 'websocket-server-party.jcreek.partykit.dev';
const partyHost = env.PUBLIC_PARTYKIT_HOST?.trim() || fallbackHost;
const partyName = env.PUBLIC_PARTYKIT_PARTY || 'main';

function getPartyKitHost() {
	return partyHost;
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
