import { BaseModule } from "../../base/BaseModule";

export default class SettingsModule extends BaseModule {
	constructor() {
		super({
			name: "settings",
			description: "Handles the settings",
		});
	}
}