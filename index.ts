import mongoose from "mongoose";
import { discordClient } from "./src/DiscordClient";
import "./src/defaults/events";
import logger from "./src/utils/logger";
logger.info("---------------------------------------------------");
await discordClient.run();
await mongoose.connect(Bun.env.MONGODB_CONNECT_URI as string);
