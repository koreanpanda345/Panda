import { Guild } from "discord.js";
import { BaseEvent } from "../../../base";
import { createSettings, hasSettings } from "../utils";

export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super({
			name: "guildCreate",
			description: "When the bot joins a new guild, we need to make a new settings for them",
		});
	}

	public async invoke(guild: Guild) {
		if (!await hasSettings(guild.id)) {
			await createSettings(guild.id);
		}
	}
}