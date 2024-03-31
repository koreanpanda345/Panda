import { Client, Collection, IntentsBitField } from "discord.js";
import {

  BaseModule,

} from "../base";
import { Logger } from "../../logger";
import { Cache } from "./cache";

export class DiscordClient extends Client {
  public logger = new Logger("client");
  // Collections
  public readonly cache: Cache = new Cache();

  constructor() {
    super({
      intents:
        IntentsBitField.Flags.MessageContent |
        IntentsBitField.Flags.Guilds |
        IntentsBitField.Flags.GuildMessages,
    });
  }

  




}

export const discordClient = new DiscordClient();