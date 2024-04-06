import { Message } from "discord.js";
import { BaseGuard } from "../../../base/BaseGuard";
import { Config } from "../../../../global";

export default class RunningCommandGuard extends BaseGuard {
	constructor() {
		super({
			name: "leveling_run_command",
			description: "Checks to see if a command is being ran or not.",
		});
	}

	public async invoke(message: Message) {
		if (message.content.startsWith(`${Config.discordClientPrefix}`)) return false;
		return true;
	}

	public async failed(message: Message) {
		return;
	}
}