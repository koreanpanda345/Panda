import { ServerSettings } from "../../../database/models/settings";

export async function createSettings(serverId: string) {
	const newSettings = new ServerSettings({
		discord_guild_id: serverId,
		modules: {
			global: true,
			economy: true,
		}
	});

	await newSettings.save();
}

export async function hasSettings(serverId: string) {
	return (await ServerSettings.findOne({ discord_guild_id: serverId })) ? true : false;
}

export async function getSettings(serverId: string) {
	return await ServerSettings.findOne({ discord_guild_id: serverId });
}