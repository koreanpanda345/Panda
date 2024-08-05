import mongoose from "mongoose";
import { discordClient } from "./bot/src/DiscordClient";
import './bot/src/defaults/events';
await discordClient.run();
await mongoose.connect(Bun.env.MONGODB_CONNECT_URI as string);