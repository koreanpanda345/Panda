import { BaseModule } from "../../base/BaseModule";

export default class ModerationModule extends BaseModule {
	constructor() {
		super({
			name: "moderation",
			description: "Handles the moderation section of the bot",
		});
	}
}