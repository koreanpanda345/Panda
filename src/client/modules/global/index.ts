import { BaseModule } from "../../base/BaseModule";

export default class GlobalModule extends BaseModule {
	constructor() {
		super({
			name: "global",
			description: "The default events and commands",
		});
	}
}