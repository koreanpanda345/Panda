import { Message } from "discord.js";
import { BaseGuard } from "../../../base/BaseGuard";
import { checkIfUserIsBlacklisted } from "../utils";

export default class BlacklistUserGuard extends BaseGuard {
	constructor() {
		super({
			name: "blacklist_user",
			description: "Checks if the user is blacklisted or not."
		});
	}

	public async invoke(message: Message) {
		let serverId = message.guildId!;
		let member = message.member!;

		// If they are blacklisted, then the guard will return false to result in a failed attempt.
		if (await checkIfUserIsBlacklisted(serverId, member)) return false;
		// If they are not blacklisted, then the guard will return true to result in a pass attempt.
		return true;
	}

	public async failed(message: Message) {
		// Since this will trigger everytime, we don't need to do anything, we will just return.
		return;
	}
}