import { REST, Routes, type Interaction } from "discord.js";
import { discordClient } from "../DiscordClient";
import logger from "../utils/logger";

discordClient.on('interactionCreate', (interaction: Interaction) => {
	if (interaction.isCommand()) {
		discordClient.invokeCommand(interaction.commandName, interaction);
	}
});

discordClient.on('ready', () => {
	const commands = [];

	for (let mod of discordClient.mods.toJSON()) {
		for (let cmd of mod.files.commands.toJSON()) {
			commands.push(cmd.info);
		}
	}

	const rest = new REST().setToken(Bun.env.DISCORD_CLIENT_TOKEN as string);

	(async () => {
		try {
			logger.debug(`Started refreshing ${commands.length} application (/) commands.`);

			const data = await rest.put(
				Routes.applicationGuildCommands(discordClient.user!.id, '439111274828136453'),
				{ body: commands},
			) as [];

			logger.debug(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			logger.error(error);
		}
	})();
});