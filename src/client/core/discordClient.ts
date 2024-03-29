import { Client, Collection, IntentsBitField } from "discord.js";
import {
  BaseCommand,
  BaseEvent,
  BaseModule,
  BaseMonitor,
  BaseTask,
} from "../base";
import { Logger } from "../../logger";
import { glob } from "glob";
import { FilePaths } from "./constants";
import { Config } from "../../global";

export class DiscordClient extends Client {
  public logger = new Logger("client");
  // Collections
  public readonly modules: Collection<string, BaseModule> = new Collection();

  constructor() {
    super({
      intents:
        IntentsBitField.Flags.MessageContent |
        IntentsBitField.Flags.Guilds |
        IntentsBitField.Flags.GuildMessages,
    });
  }

  public getCommandFromMod(mod: string, name: string) {
    if (!this.modules.has(mod)) {
      this.logger.error(`[Mod ${mod}] doesn't seem to exist in the collector!`);
      return null;
    }
    return this.modules
      .get(mod)
      ?.commands.find((c) => c.name === name || c.alias.includes(name));
  }

  public async addModule(name: string) {
    try {
      this.logger.info(`Loading Module ${name}...`);
      const files = glob.sync(
        `./${
          Config.workspaceState === "DEVELOPMENT"
            ? FilePaths.development_modules
            : FilePaths.production_modules
        }/${name}/**/*.${Config.workspaceState === "DEVELOPMENT" ? "ts" : "js"}`
      );
      for (let file of files) {
        file = file.replace(/\\/g, "/");
        let skip = false;
        if (
          file ===
          `${
            Config.workspaceState === "DEVELOPMENT"
              ? FilePaths.development_modules
              : FilePaths.production_modules
          }/${name}/index.${
            Config.workspaceState === "DEVELOPMENT" ? "ts" : "js"
          }`
        ) {
          // Module File
          const { default: mod } = await import(
            `./${FilePaths.import_modules}/${name}/index.${
              Config.workspaceState === "DEVELOPMENT" ? "ts" : "js"
            }`
          );
          const module = new mod() as BaseModule;

          if (this.modules.has(module.name)) {
            this.logger.warn(
              `Module ${name} shares the same name with another module that has been added in.`
            );
            this.logger.error(`Module ${name} [SKIPPED]`);
            return;
          }
          this.modules.set(module.name, module);
        } else if (file.includes("/commands/")) {
          // Command File
          const { default: cmd } = await import(
            `${FilePaths.import_modules}/${name}/${file.split(`/${name}/`)[1]}`
          );
          const command = new cmd() as BaseCommand;
          this.logger.debug(
            `Loading Command ${command.name} in Module ${name}...`
          );
          this.modules.forEach((m) => {
            if (m.commands.has(command.name)) {
              this.logger.warn(
                `[(Mod ${name}) Command ${command.name}] shares the same name as [(Mod ${m.name}) Command ${command.name}]`
              );
              skip = true;
            } else if (m.commands.find((c) => c.alias.includes(command.name))) {
              this.logger.warn(
                `[(Mod ${name}) Command ${
                  command.name
                }] shares the same name as alias on [(Mod ${
                  m.name
                }) ${m.commands.find((c) => c.alias.includes(command.name))}]`
              );
              skip = true;
            }
            for (let alias of command.alias) {
              if (m.commands.has(alias)) {
                this.logger.warn(
                  `[(Mod ${name}) Command ${
                    command.name
                  }] alias ${alias} shares the same name as [(Mod ${
                    m.name
                  }) Command ${m.commands.get(alias)?.name}]`
                );
                skip = true;
              } else if (m.commands.find((c) => c.alias.includes(alias))) {
                this.logger.warn(
                  `[(Mod ${name}) Command ${
                    command.name
                  }] alias ${alias} shares the same alias as [(Mod ${
                    m.name
                  }) Command ${
                    m.commands.find((c) => c.alias.includes(alias))?.name
                  }]`
                );
                skip = true;
              }
            }
          });

          if (skip) {
            this.logger.error(
              `[(Mod ${name}) Command ${command.name}] [SKIPPED]`
            );
          } else {
            this.modules.get(name)?.commands.set(command.name, command);
            this.logger.info(
              `[(Mod ${name}) Command ${command.name}] [LOADED]`
            );
          }
        } else if (file.includes("/events/")) {
          // Event Files
          const { default: evt } = await import(
            `${FilePaths.import_modules}/${name}/${file.split(`/${name}/`)[1]}`
          );
          const event = new evt() as BaseEvent;
          this.logger.debug(`Loading Event ${event.name} in Module ${name}...`);

          if (skip) {
            this.logger.error(`[(Mod ${name}) Event ${event.name}] [SKIPPED]`);
          } else {
            this.modules.get(name)?.events.set(event.name, event);
            if (event.onlyOnce)
              this.once(
                event.name,
                async (...args) => await event.invoke(...args)
              );
            else
              this.on(
                event.name,
                async (...args) => await event.invoke(...args)
              );
            this.logger.info(`[(Mod ${name}) Event ${event.name}] [LOADED]`);
          }
        } else if (file.includes("/monitors/")) {
          // Monitor Files
          const { default: mon } = await import(
            `${FilePaths.import_modules}/${name}/${file.split(`/${name}/`)[1]}`
          );
          const monitor = new mon() as BaseMonitor;
          this.logger.debug(
            `Loading Monitor ${monitor.name} in Module ${name}...`
          );
          this.modules.forEach((m) => {
            if (m.monitors.has(monitor.name)) {
              this.logger.warn(
                `[(Mod ${name}) Monitor ${monitor.name}] shares the same name as [(Mod ${m.name}) Monitor ${monitor.name}]`
              );
              skip = true;
            }
          });

          if (skip) {
            this.logger.error(
              `[(Mod ${name}) Monitor ${monitor.name}] [SKIPPED]`
            );
          } else {
            this.modules.get(name)?.monitors.set(monitor.name, monitor);
            this.logger.info(
              `[(Mod ${name}) Monitor ${monitor.name}] [LOADED]`
            );
          }
        } else if (file.includes("/tasks/")) {
          // Task Files
          const { default: tsk } = await import(
            `${FilePaths.import_modules}/${name}/${file.split(`/${name}/`)[1]}`
          );
          const task = new tsk() as BaseTask;
          this.logger.debug(`Loading Task ${task.name} in Module ${name}...`);
          this.modules.forEach((m) => {
            if (m.tasks.has(task.name)) {
              this.logger.warn(
                `[(Mod ${name}) Task ${task.name}] shares the same name as [(Mod ${m.name}) Task ${task.name}]`
              );
              skip = true;
            }
          });

          if (skip) {
            this.logger.error(`[(Mod ${name}) Task ${task.name}] [SKIPPED]`);
          } else {
            this.modules.get(name)?.tasks.set(task.name, task);
            this.logger.info(`[(Mod ${name}) Task ${task.name}] [LOADED]`);
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `There seems to be a problem with loading Module ${name}! [SKIPPED]`
      );
      console.error(error);

      return null;
    } finally {
      this.logger.info(`Successfully loaded Module ${name}!`);
    }
  }
}

export const discordClient = new DiscordClient();
