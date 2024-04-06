import { Message } from "discord.js";
import { BaseMonitor } from "../../../base";
import { addExpToUser, createUserInLevelingSchema, getLevelingSchema, hasUserInLevelingSchema } from "../utils";
import { Logger } from "../../../../logger";
import { handleTask } from "../../../core/utils";

export default class ExpMonitor extends BaseMonitor {
	constructor() {
		super({
			name: "exp_monitor",
			description: "Handles the transactions of exp",
		});
	}

	public async invoke(message: Message) {
		if (!await hasUserInLevelingSchema(message.guildId!, message.author.id)) {
			await createUserInLevelingSchema(message.guildId!, message.author.id);
		}
		const leveling = await getLevelingSchema(message.guildId!);
		await addExpToUser(message.guildId!, message.author.id, leveling?.settings.rate! || 1);
		const logger = new Logger("client:module:leveling:monitor:exp");
		logger.debug(`Added ${leveling?.settings.rate! || 1} exp to ${message.author.id}!`);
		await handleTask('leveling', 'levelup', message);
	}
}