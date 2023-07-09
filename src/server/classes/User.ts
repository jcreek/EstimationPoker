export class User {
	userId: string;
	name: string;
	estimate: number | null;

	constructor(userId: string, name: string) {
		this.userId = userId;
		this.name = name;
		this.estimate = null;
	}
}
