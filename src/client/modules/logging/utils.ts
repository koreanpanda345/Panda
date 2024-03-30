import { LoggingSettings } from "../../../database/models/logging";

export async function createLoggingSettings(serverId: string) {
	const newSettings = new LoggingSettings({
		discord_guild_id: serverId,
		mod_logs: {
			channel_id: "",
			enable: false,
		}
	});

	await newSettings.save();
	return newSettings;
}

export async function hasLoggingSettings(serverId: string) {
	return (await LoggingSettings.findOne({ discord_guild_id: serverId })) ? true : false;
}

export async function getLoggingSettings(serverId: string) {
	return await LoggingSettings.findOne({ discord_guild_id: serverId });
}

export async function disableModLogs(serverId: string) {
	const settings = await getLoggingSettings(serverId);
	settings!.mod_logs.enable = false;
	await settings?.save();
}

export async function enableModLogs(serverId: string) {
	const settings = await getLoggingSettings(serverId);
	settings!.mod_logs.enable = true;
	await settings?.save();
}

export async function changeModLogChannel(serverId: string, channelId: string) {
	const settings = await getLoggingSettings(serverId);
	settings!.mod_logs.channel_id = channelId;
	await settings?.save();
}