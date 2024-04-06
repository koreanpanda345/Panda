import { BaseModule } from "../../base/BaseModule";

export default class ModerationModule extends BaseModule {
	constructor() {
		super({
			name: "logging",
			description: "Handles the logging system for the bot.",
		});
	}
}