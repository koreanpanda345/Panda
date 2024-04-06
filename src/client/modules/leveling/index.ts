import { BaseModule } from "../../base/BaseModule";

export default class SettingsModule extends BaseModule {
	constructor() {
		super({
			name: "leveling",
			description: "Handles the leveling module of the bot.",
		});

		this.guardOrder.set('monitor:exp_monitor', ['guard:blacklist_user', 'monitor:exp_monitor'])
	}
}