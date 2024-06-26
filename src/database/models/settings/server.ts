import { Schema, model } from "mongoose";

export interface IServerSettings {
	discord_guild_id: string;
	modules: {
		global: boolean;
		economy: boolean;
		moderation: boolean;
		logging: boolean;
		leveling: boolean;
	}
}

const ServerSettingsSchema = new Schema<IServerSettings>({
	discord_guild_id: String,
	modules: {
		global: Boolean,
		economy: Boolean,
		moderation: Boolean,
		logging: Boolean,
		leveling: Boolean,
	}
});

export default model<IServerSettings>("server_settings", ServerSettingsSchema);