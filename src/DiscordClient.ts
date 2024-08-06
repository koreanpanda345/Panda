import {
  Client,
  Collection,
  CommandInteraction,
  IntentsBitField,
  type Interaction,
} from "discord.js";
import { loadMods } from "./utils/fs";
import type BaseModule from "./base/BaseModule";
import logger from "./utils/logger";
import SlashCommandContext from "./context/SlashCommandContext";

export default interface DiscordClient extends Client {
  mods: Collection<string, BaseModule>;
}

export default class DiscordClient extends Client {
  constructor() {
    super({
      intents: [
        // Guild Intents
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        // Direct Intents
        IntentsBitField.Flags.DirectMessages,
      ],
    });
    this.mods = new Collection();
  }

  /**
   * @description Runs the client on discord
   * @returns Connection to discord
   */
  public async run() {
    let mods = await loadMods();
    for (let mod of mods) {
      this.mods.set(mod.info.name, mod);
      logger.debug(`[${mod.info.name} mod] Loaded!`);
    }
    await this.loadRequiredModFiles();
    this.login(Bun.env.DISCORD_CLIENT_TOKEN);
  }

  private async loadRequiredModFiles() {
    for (let mod of this.mods.toJSON()) {
      await mod.loadRequiredModFiles();
    }
    await this.invokeEvents();
  }

  private async invokeEvents() {
    for (let mod of this.mods.toJSON()) {
      for (let event of mod.files.events.toJSON()) {
        if (event.configurations.disabled) continue;
        if (event.configurations.onlyOnce)
          this.once(
            event.configurations.eventName,
            async (...args: any[]) => await event.invoke(...args)
          );
        else
          this.on(
            event.configurations.eventName,
            async (...args: any[]) => await event.invoke(...args)
          );
      }
    }
  }

  public getModule(name: string) {
    return this.mods.get(name);
  }

  public invokeCommand(name: string, interaction: Interaction) {
    return this.mods
      .find((mod) => mod.getCommand(name) !== undefined)
      ?.invokeCommand(
        name,
        new SlashCommandContext(interaction as CommandInteraction)
      );
  }

  public invokeMonitor(name: string, ...args: any[]) {
    return this.mods
      .find((mod) => mod.getMonitor(name) !== undefined)
      ?.invokeMonitor(name, ...args);
  }

  public invokeTask(name: string, ...args: any[]) {
    return this.mods
      .find((mod) => mod.getTask(name) !== undefined)
      ?.invokeTask(name, ...args);
  }
}

export const discordClient = new DiscordClient();
