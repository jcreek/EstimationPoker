export class SelectEstimateMessage {
	type: string;
	roomId: string;
	userId: string;
	estimate: number | string;

	constructor(roomId: string, userId: string, estimate: number | string) {
		this.type = 'select-estimate';
		this.roomId = roomId;
		this.userId = userId;
		this.estimate = estimate;
	}
}
