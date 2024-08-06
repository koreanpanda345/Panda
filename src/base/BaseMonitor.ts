export default interface BaseMonitor {
	info: {
		name: string;
	}

	configurations: {
		disabled: boolean;
	}
	invoke(...args: any[]): Promise<unknown>;
}

export default class BaseMonitor {
	constructor(name: string, disabled: boolean = false) {
		this.info = {
			name,
		};

		this.configurations = {
			disabled,
		};
	}

	async invoke() {
		throw "Not yet implemented";
	}

}