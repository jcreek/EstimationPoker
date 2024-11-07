import type * as Party from 'partykit/server';
import { User } from './User.js';

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
	users: Map<Party.Connection, User>;

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

	addUser(connection: Party.Connection, user: User) {
		this.users.set(connection, user);
	}

	removeUser(connection: Party.Connection) {
		this.users.delete(connection);
	}

	getUsers() {
		return Array.from(this.users.values());
	}

	getUserByConnection(connection: Party.Connection): User | undefined {
		return this.users.get(connection);
	}

	getConnectionByUser(user: User): Party.Connection | null {
		for (const [connection, u] of this.users) {
			if (u === user) {
				return connection;
			}
		}
		return null;
	}

	getConnectionByUserId(userId: string): Party.Connection | null {
		for (const [connection, u] of this.users) {
			if (u.userId === userId) {
				return connection;
			}
		}
		return null;
	}

	broadcast(message: any) {
		const messageString = JSON.stringify(message);
		this.users.forEach((user, connection) => {
			connection.send(messageString);
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
