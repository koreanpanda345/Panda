export default interface BaseTask {
	info: {
		name: string;
	}

	configurations: {
		disabled: boolean;
	}

	invoke(...args: any[]): Promise<unknown>;
}

export default class BaseTask {
	constructor(name: string, disabled: boolean = false) {
		this.info = {
			name
		};
		this.configurations = {
			disabled,
		};
	}

	async invoke() {
		throw "Not Yet Implemented";
	}
}