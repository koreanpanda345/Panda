require('dotenv').config();
import { discordClient } from "./client/core";
import Config from "./global/config";

(async() => {
	await discordClient.addModule('global');
	await discordClient.addModule('global');
	discordClient.login(Config.discordClientToken);
})();