import { GuildMember } from "discord.js";
import { Leveling } from "../../../database/models/leveling";

export async function createLevelingSchema(serverId: string) {
	const newSchema = new Leveling({
		discord_guild_id: serverId,
		settings: {
			disable: true,
			rate: 1,
			quiet: false,
			embed: true,
			channel_id: "",
			blacklist: {
				channels: [],
				users: [],
				roles: [],
			},
			rewards: {
				enable: false,
				levels: [],
			}
		},
		users: [],
	});

	await newSchema.save();
}

export async function hasLevelingSchmea(serverId: string) {
	return await Leveling.findOne({ discord_guild_id: serverId }) ? true : false;
}

export async function getLevelingSchema(serverId: string) {
	return await Leveling.findOne({ discord_guild_id: serverId });
}

export async function hasUserInLevelingSchema(serverId: string, userId: string) {
	const leveling = await getLevelingSchema(serverId);

	return leveling?.users && leveling?.users.find((x) => x.discord_user_id === userId) ? true : false;
}

export async function createUserInLevelingSchema(serverId: string, userId: string) {
	const leveling = await getLevelingSchema(serverId);
	if (!leveling?.users) leveling!.users = [];
	leveling?.users.push({
		discord_user_id: userId,
		exp: {
			current: 0,
			needed: 100,
		},
		level: {
			current: 1,
			next: 2,
		},
		profile: {
			background_image: "",
			description: "",
		},
		settings: {
			quiet: false,
		},
	});

	await leveling?.save();
}

export async function addExpToUser(serverId: string, userId: string, amount: number) {
	if (!await hasLevelingSchmea(serverId)) {
		await createLevelingSchema(serverId);
	}
	if (!await hasUserInLevelingSchema(serverId, userId)) {
		await createUserInLevelingSchema(serverId, userId);
	}

	const leveling = await getLevelingSchema(serverId);

	leveling!.users.find((x) => x.discord_user_id === userId)!.exp.current += amount;

	await leveling?.save();
}

export async function increaseLevelToUser(serverId: string, userId: string, amount: number) {
	if (!await hasLevelingSchmea(serverId)) {
		await createLevelingSchema(serverId);
	}
	if (!await hasUserInLevelingSchema(serverId, userId)) {
		await createUserInLevelingSchema(serverId, userId);
	}

	const leveling = await getLevelingSchema(serverId)!;

	leveling!.users.find((x) => x.discord_user_id === userId)!.level.current += amount;
	leveling!.users.find((x) => x.discord_user_id === userId)!.level.next += amount;
	leveling!.users.find((x) => x.discord_user_id === userId)!.exp.current = 0;
	leveling!.users.find((x) => x.discord_user_id === userId)!.exp.needed *= (2 * amount);

	await leveling?.save();
}

export async function checkIfUserIsBlacklisted(serverId: string, member: GuildMember) {
	if (!await hasLevelingSchmea(serverId)) {
		await createLevelingSchema(serverId);
	}
	if (!await hasUserInLevelingSchema(serverId, member.id)) {
		await createUserInLevelingSchema(serverId, member.id);
		return false; // since the user doesn't have a leveling data, this probably means they just joined the server.
	}

	const leveling = await getLevelingSchema(serverId);

	if (leveling!.settings.blacklist) {
		// The user is added to the user blacklist
		if (leveling!.settings.blacklist.users.includes(member.id)) return true;
		// The user has a role that is blacklisted
		member.roles.cache.forEach((r) => {
			if (leveling!.settings.blacklist.roles.includes(r.id)) return true;
		});
		return false;
	}
	return false;
}

export async function checkIfChannelIsBlacklisted(serverId: string, channelId: string) {
	if (!await hasLevelingSchmea(serverId)) {
		await createLevelingSchema(serverId);
	}

	const leveling = await getLevelingSchema(serverId);

	if (leveling?.settings.blacklist) {
		if (leveling.settings.blacklist.channels.includes(channelId)) return true;
		return false;
	}
	
	return false;
}