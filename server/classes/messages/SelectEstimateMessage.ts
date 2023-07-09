export class SelectEstimateMessage {
	type: string;
	roomId: string;
	userId: string;
	estimate: number;

	constructor(roomId: string, userId: string, estimate: number) {
		this.type = 'select-estimate';
		this.roomId = roomId;
		this.userId = userId;
		this.estimate = estimate;
	}
}
