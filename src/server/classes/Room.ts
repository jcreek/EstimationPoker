import { WebSocket } from 'ws';
import { User } from './User';

class CardSet {
	name: string;
	values: Array<string | number>;
	example: string;

	constructor(name: string, values: Array<string | number>, example: string) {
		this.name = name;
		this.values = values;
		this.example = example;
	}
}

export const cardSets: Array<CardSet> = [
	{ name: 'Fibonacci', values: [1, 2, 3, 5, 8, 13, 21, '?'], example: '(1, 2, 3, 5)' },
	{
		name: 'T-Shirt Sizing',
		values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?'],
		example: '(XS, S, M, L)'
	},
	{ name: 'Powers of 2', values: [1, 2, 4, 8, 16, 32, '?'], example: '(1, 2, 4, 8)' },
	{ name: 'Sequential', values: [1, 2, 3, 4, 5, 6, 7, 8, 9, '?'], example: '(1, 2, 3, 4)' }
];

export class Room {
	id: string;
	cardSet: CardSet;
	users: Map<WebSocket, User>;

	constructor(id: string, cardSetName: string) {
		this.id = id;
		const cardSet = cardSets.find((cardSet) => cardSet.name === cardSetName);
		if (cardSet) {
			this.cardSet = cardSet;
		} else {
			this.cardSet = cardSets[0];
		}
		
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

	getWebSocketByUser(user: User): WebSocket | null {
		for (const [ws, u] of this.users) {
			if (u === user) {
				return ws;
			}
		}
		return null;
	}

	getWebSocketByUserId(userId: String): WebSocket | null {
		for (const [ws, u] of this.users) {
			if (u.userId === userId) {
				return ws;
			}
		}
		return null;
	}

	broadcast(message: any) {
		this.users.forEach((user, client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	getAllEstimates() {
		const estimates = new Map<string, number | string>();
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
