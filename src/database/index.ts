import mongoose from "mongoose"
import { Config } from "../global";
import { Logger } from "../logger";

const logger = new Logger('database');

(async () => {
	if (Config.databaseURI === "NO DATABASE URL") {
		logger.error(`ENV DATABASE_URI Doesn't seem to be set up. Please set up MONGODB_CONNECT_URI!`);
		return;
	} else await mongoose.connect(Config.databaseURI);
})()