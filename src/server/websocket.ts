import type * as Party from 'partykit/server';
import { Room } from './classes/Room.js';
import { User } from './classes/User.js';
import { JoinRoomMessage } from './classes/messages/JoinRoomMessage.js';
import { SelectEstimateMessage } from './classes/messages/SelectEstimateMessage.js';

type StoredRoom = {
	id: string;
	cardSetName: string;
};

export default class EstimationParty implements Party.Server {
	room: Room | null = null;
	private nudgeTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(public party: Party.Room) {}

	async onStart() {
		const savedRoom = (await this.party.storage.get('room')) as StoredRoom | undefined;
		if (savedRoom?.cardSetName) {
			this.room = new Room(savedRoom.id ?? this.party.id, savedRoom.cardSetName);
		}
	}

	async onConnect(_connection: Party.Connection) {}

	async onClose(connection: Party.Connection) {
		if (!this.room) {
			return;
		}

		const user = this.room.getUserByConnection(connection);
		if (!user) {
			return;
		}

		this.room.removeUser(connection);
		await this.updateRoomState();
		this.party.broadcast(JSON.stringify({ type: 'user-left', userId: user.userId }));

		if (this.room.getUsers().length === 0) {
			this.clearNudgeTimeout();
			await this.party.storage.delete('room');
			this.room = null;
		}
	}

	async onMessage(message: string | ArrayBuffer | ArrayBufferView, connection: Party.Connection) {
		if (typeof message !== 'string') {
			console.log('Unsupported message payload type');
			return;
		}
		const data = JSON.parse(message);

		switch (data.type) {
			case 'create-room':
				this.room = new Room(this.party.id, data.cardSetName ?? '');
				await this.updateRoomState();
				break;

			case 'join-room':
				{
					this.room = await this.getOrCreateRoom(data.cardSetName);
					if (!this.room) {
						break;
					}
					const joinRoomMessage: JoinRoomMessage = data as JoinRoomMessage;
					const { userId, name } = joinRoomMessage;
					const user = new User(userId, name);
					this.room.addUser(connection, user);
					await this.updateRoomState();
					this.party.broadcast(
						JSON.stringify({ type: 'user-joined', message: `${name} has joined the room` })
					);
				}
				break;

			case 'select-estimate':
				{
					this.room = await this.getOrCreateRoom();
					if (!this.room) {
						break;
					}
					const selectEstimateMessage: SelectEstimateMessage = data as SelectEstimateMessage;
					const { userId, estimate } = selectEstimateMessage;
					const user = this.room.getUserByConnection(connection);
					if (!user) {
						break;
					}
					user.estimate = estimate;
					await this.updateRoomState();
					this.party.broadcast(
						JSON.stringify({
							type: 'estimate-selected',
							userId,
							name: user.name,
							estimate
						})
					);

					const users = this.room.getUsers();
					const allEstimates = this.room.getAllEstimates();
					if (allEstimates.size === users.length) {
						this.clearNudgeTimeout();
						this.party.broadcast(
							JSON.stringify({
								type: 'estimation-closed',
								groupedEstimates: this.groupEstimates()
							})
						);
					} else if (allEstimates.size === users.length - 1) {
						const notEstimatedUser = users.find((candidate) => !allEstimates.has(candidate.name));
						if (notEstimatedUser) {
							this.scheduleNudge(notEstimatedUser);
						}
					}
				}
				break;

			case 'restart-estimation':
				if (this.room) {
					this.clearNudgeTimeout();
					this.room.clearEstimates();
					await this.updateRoomState();
					this.party.broadcast(JSON.stringify({ type: 'estimation-restarted' }));
				}
				break;

			case 'get-user-estimates':
				if (this.room) {
					const users = this.room.getUsers();
					connection.send(
						JSON.stringify({ type: 'user-estimates', users, selectedCardSet: this.room.cardSet })
					);
				}
				break;

			case 'trigger-emoji':
				if (this.room) {
					const { cardId, emoji } = data;
					this.party.broadcast(JSON.stringify({ type: 'trigger-emoji', cardId, emoji }));
				}
				break;

			case 'ping':
				connection.send(JSON.stringify({ type: 'pong' }));
				break;

			case 'kick-user':
				if (this.room) {
					const userIdToKick = data.userId;
					const connectionToKick = this.room.getConnectionByUserId(userIdToKick);
					if (connectionToKick) {
						connectionToKick.close();
						this.room.removeUser(connectionToKick);
					}
					await this.updateRoomState();
					this.party.broadcast(JSON.stringify({ type: 'user-left', userId: userIdToKick }));
				}
				break;

			default:
				console.log('Unknown message type:', data.type);
		}
	}

	// Helper to broadcast the current room state to all users in the room
	private async updateRoomState() {
		if (this.room) {
			await this.party.storage.put('room', {
				id: this.room.id,
				cardSetName: this.room.cardSet.name
			});
		}
	}

	// Group user estimates into a map of estimates -> list of user names
	private groupEstimates() {
		const users = this.room ? this.room.getUsers() : [];
		const estimateGroups: { [key: number | string]: string[] } = {};
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

	private async getOrCreateRoom(cardSetName?: string): Promise<Room | null> {
		if (this.room) {
			return this.room;
		}

		const savedRoom = (await this.party.storage.get('room')) as StoredRoom | undefined;
		if (savedRoom?.cardSetName) {
			this.room = new Room(savedRoom.id ?? this.party.id, savedRoom.cardSetName);
			return this.room;
		}

		this.room = new Room(this.party.id, cardSetName ?? '');
		await this.updateRoomState();
		return this.room;
	}

	private scheduleNudge(user: User) {
		this.clearNudgeTimeout();

		if (!this.room) {
			return;
		}

		const connection = this.room.getConnectionByUser(user);
		if (!connection) {
			return;
		}

		this.nudgeTimeout = setTimeout(() => {
			if (!this.room) {
				return;
			}

			const allEstimates = this.room.getAllEstimates();
			if (!allEstimates.has(user.name)) {
				connection.send(JSON.stringify({ type: 'nudge' }));
			}
		}, 30000);
	}

	private clearNudgeTimeout() {
		if (this.nudgeTimeout) {
			clearTimeout(this.nudgeTimeout);
			this.nudgeTimeout = null;
		}
	}
}
