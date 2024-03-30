import { Schema, model } from "mongoose";

export interface ILoggingSettings {
	discord_guild_id: string;
	mod_logs: {
		channel_id: string;
		enable: boolean;
	}
}

const LoggingSettingsSchema = new Schema<ILoggingSettings>({
	discord_guild_id: String,
	mod_logs: {
		channel_id: String,
		enable: Boolean,
	},
});

export default model<ILoggingSettings>("logging_settings", LoggingSettingsSchema);