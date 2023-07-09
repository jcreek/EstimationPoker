import { WebSocket } from 'ws';
import { User } from './User';

export class Room {
	id: string;
	users: Map<WebSocket, User>;

	constructor(id: string) {
		this.id = id;
		this.users = new Map();
	}

	addUser(ws: WebSocket, user: User) {
		this.users.set(ws, user);
	}

	removeUser(ws: WebSocket) {
		this.users.delete(ws);
	}

	getUsers() {
		return Array.from(this.users.values());
	}

	getUserByWebSocket(ws: WebSocket) {
		return this.users.get(ws);
	}

	broadcast(message: any) {
		this.users.forEach((user, client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	getAllEstimates() {
		const estimates = new Map<string, number>();
		this.users.forEach((user) => {
			if (user.estimate !== null) {
				estimates.set(user.name, user.estimate);
			}
		});
		return estimates;
	}

	clearEstimates() {
		this.users.forEach((user) => {
			user.estimate = null;
		});
	}
}
