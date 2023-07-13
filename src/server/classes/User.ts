export class User {
	userId: string;
	name: string;
	estimate: number | string | null;

	constructor(userId: string, name: string) {
		this.userId = userId;
		this.name = name;
		this.estimate = null;
	}
}
