import { Schema, model } from "mongoose";

export interface ILeveling {
	discord_guild_id: string;
	settings: {
		disable: boolean;
		rate: number;
		quiet: boolean;
		embed: boolean;
		channel_id: string;
		blacklist: {
			channels: string[];
			users: string[];
			roles: string[];
		};
		rewards: {
			enable: boolean;
			levels: {
				level: number,
				reward: {
					role_id?: string;
					money?: string;
					other?: string;
					description?: string;
				}[];
			}[]
		}
	};
	users: {
		discord_user_id: string,
		exp: {
			current: number,
			needed: number,
		},
		level: {
			current: number,
			next: number,
		},
		profile: {
			background_image: string,
			description: string,
		},
		settings: {
			quiet: boolean,
		}
	}[],
}

const LevelingSchema = new Schema<ILeveling>({
	discord_guild_id: String,
	settings: {
		disable: Boolean,
		rate: Number,
		quiet: Boolean,
		embed: Boolean,
		channel_id: String,
		blacklist: {
			channels: [String],
			users: [String],
			roles: [String],
		},
		rewards: {
			enable: Boolean,
			levels: [{
				level: Number,
				reward: [{
					role_id: String,
					money: String,
					other: String,
					description: String
				}],
			}],
		},
	},
	users: [{
		discord_user_id: String,
		exp: {
			current: Number,
			needed: Number,
		},
		level: {
			current: Number,
			next: Number,
		},
		profile: {
			background_image: String,
			description: String,
		},
		settings: {
			quiet: Boolean,
		},
	}],
});

export default model<ILeveling>("leveling", LevelingSchema);