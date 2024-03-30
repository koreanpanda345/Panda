import { Config } from "../global";
import { Logger } from "../logger";
import { discordClient } from "./core";

const logger = new Logger("client");
(async () => {
	['settings', 'global', 'economy', 'moderation', 'logging'].forEach(async x => await discordClient.addModule(x));

  if (Config.discordClientToken === "NO TOKEN") {
    logger.error(
      "ENV DISCORD_CLIENT_TOKEN has not been set up correctly! Please add in DISCORD_CLIENT_TOKEN!"
    );
    return;
  } else discordClient.login(Config.discordClientToken);
})();
