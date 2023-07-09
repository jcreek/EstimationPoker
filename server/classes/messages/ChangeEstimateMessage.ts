export class ChangeEstimateMessage {
	type: string;
	roomId: string;
	userId: string;
	estimate: number;

	constructor(roomId: string, userId: string, estimate: number) {
		this.type = 'change-estimate';
		this.roomId = roomId;
		this.userId = userId;
		this.estimate = estimate;
	}
}
