import { Collection } from "discord.js";
import {
  BaseCommand,
  BaseEvent,
  BaseModule,
  BaseMonitor,
  BaseTask,
} from "../base";
import { Logger } from "../../logger";
import { glob } from "glob";
import { Config } from "../../global";
import { BaseGuard } from "../base/BaseGuard";
import { FilePaths } from "./constants";
import { discordClient } from "./discordClient";
export class Cache {
  private _logger = new Logger("client:cache");
  public readonly modules: Collection<string, BaseModule> = new Collection();

  public getCommandFromMod(mod: string, name: string) {
    if (!this.modules.has(mod)) {
      this._logger.error(
        `[Mod ${mod}] doesn't seem to exist in the collector!`
      );
      return null;
    }
    return this.modules
      .get(mod)
      ?.commands.find((c) => c.name === name || c.alias.includes(name));
  }
  public getGuardFromMod(mod: string, name: string) {
    if (this.modules.has(mod)) {
      this._logger.error(
        `[Mod ${mod}] doesn't seem to exist in the collector!`
      );
      return null;
    }

    return this.modules.get(mod)?.guards.get(name);
  }
  public getMonitorFromMod(mod: string, name: string) {
	if (!this.modules.has(mod)) {
		this._logger.error(`[Mod ${mod}] doesn't seem to exist in the collector!`);
		return null;
	}

	return this.modules.get(mod)?.monitors.get(name);
  }

  public async addModule(name: string) {
    try {
      this._logger.info(`Loading Module ${name}...`);
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
            this._logger.warn(
              `Module ${name} shares the same name with another module that has been added in.`
            );
            this._logger.error(`Module ${name} [SKIPPED]`);
            return;
          }
          this.modules.set(module.name, module);
        } else if (file.includes("/commands/")) {
          // Command File
          await this.loadCommand(file, name);
        } else if (file.includes("/events/")) {
          // Event Files
          await this.loadEvent(file, name);
        } else if (file.includes("/guards/")) {
          // Guard Files
          await this.loadGuard(file, name);
        } else if (file.includes("/monitors/")) {
          // Monitor Files
          await this.loadMonitor(file, name);
        } else if (file.includes("/tasks/")) {
          // Task Files
		  await this.loadTask(file, name);
        }
      }
    } catch (error) {
      this._logger.error(
        `[Mod ${name}] There was a problem trying to load part of the module.`
      );
      console.error(error);

      return null;
    } finally {
      this._logger.info(`Successfully loaded Module ${name}!`);
    }
  }
  private async loadCommand(file: string, mod: string) {
    const { default: cmd } = await import(
      `${FilePaths.import_modules}/${mod}/${file.split(`/${mod}/`)[1]}`
    );
    const command = new cmd() as BaseCommand;
    this._logger.debug(`[Mod ${mod}] Loading Command ${command.name}....`);
    let skip = false;
    this.modules.forEach((module) => {
      if (module.commands.has(command.name)) {
        this._logger.warn(
          `[(Mod ${mod}) Command ${command.name}] shares the same name as [(Mod ${module.name}) ${command.name}]`
        );
        skip = true;
      } else if (module.commands.find((c) => c.alias.includes(command.name))) {
        this._logger.warn(
          `[(Mod ${mod}) Command ${
            command.name
          }] shares the same name as alias on [(Mod ${
            module.name
          }) Command ${module.commands.find((c) =>
            c.alias.includes(command.name)
          )}]`
        );
        skip = true;
      }
      for (let alias of command.alias) {
        if (module.commands.has(alias)) {
          this._logger.warn(
            `[(Mod ${mod}) Command ${
              command.name
            }] alias ${alias} shares the same name as [(Mod ${
              module.name
            }) Command ${module.commands.get(alias)?.name}]`
          );
          skip = true;
        } else if (module.commands.find((c) => c.alias.includes(alias))) {
          this._logger.warn(
            `[(Mod ${mod}) Command ${
              command.name
            }] alias ${alias} shares the same alias as [(Mod ${
              module.name
            }) Command ${
              module.commands.find((c) => c.alias.includes(alias))?.name
            }]`
          );
          skip = true;
        }
      }
    });

    if (skip) {
      this._logger.error(`[(Mod ${mod}) Command ${command.name}] [SKIPPED]`);
    } else {
      this.modules.get(mod)?.commands.set(command.name, command);
      this._logger.info(`[(Mod ${mod}) Command ${command.name}] [LOADED]`);
    }
  }
  private async loadEvent(file: string, mod: string) {
    const { default: evt } = await import(
      `${FilePaths.import_modules}/${mod}/${file.split(`/${mod}/`)[1]}`
    );
    const event = new evt() as BaseEvent;
    this._logger.debug(`[Mod ${mod}] Loading Event ${event.name}....`);
    let skip = false;
    if (skip) {
      this._logger.error(`[(Mod ${mod}) Event ${event.name}] [SKIPPED]`);
    } else {
      this.modules.get(mod)?.events.set(event.name, event);
      if (event.onlyOnce)
        discordClient.once(
          event.name,
          async (...args) => await event.invoke(...args)
        );
      else
        discordClient.on(
          event.name,
          async (...args) => await event.invoke(...args)
        );
      this._logger.info(`[(Mod ${mod}) Event ${event.name}] [LOADED]`);
    }
  }
  private async loadGuard(file: string, mod: string) {
    const { default: grd } = await import(
      `${FilePaths.import_modules}/${mod}/${file.split(`/${mod}/`)[1]}`
    );
    const guard = new grd() as BaseGuard;
    this._logger.debug(`[Mod ${mod}] Loading Guard ${guard.name}....`);
    let skip = false;
    this.modules.forEach((module) => {
      if (module.guards.has(guard.name)) {
        this._logger.warn(
          `[(Mod ${mod}) Guard ${guard.name}] shares the same name as [(Mod ${module.name}) Guard ${guard.name}]`
        );
        skip = true;
      }
    });

    if (skip) {
      this._logger.error(`[(Mod ${mod}) Guard ${guard.name}] [SKIPPED]`);
    } else {
      this.modules.get(mod)?.guards.set(guard.name, guard);
      this._logger.info(`[(Mod ${mod}) Guard ${guard.name}] [LOADED]`);
    }
  }
  private async loadMonitor(file: string, mod: string) {
    const { default: mon } = await import(
      `${FilePaths.import_modules}/${mod}/${file.split(`/${mod}/`)[1]}`
    );
    const monitor = new mon() as BaseMonitor;
    this._logger.debug(`[Mod ${mod}] Loading Monitor ${monitor.name}....`);
    let skip = false;
    this.modules.forEach((module) => {
      if (module.monitors.has(monitor.name)) {
        this._logger.warn(
          `[(Mod ${mod}) Monitor ${monitor.name}] shares the same name as [(Mod ${module.name}) Monitor ${monitor.name}]`
        );
        skip = true;
      }
    });

    if (skip) {
      this._logger.error(`[(Mod ${mod}) Monitor ${monitor.name}] [SKIPPED]`);
    } else {
      this.modules.get(mod)?.monitors.set(monitor.name, monitor);
      this._logger.info(`[(Mod ${mod}) Monitor ${monitor.name}] [LOADED]`);
    }
  }
  private async loadTask(file: string, mod: string) {
    const { default: tsk } = await import(
      `${FilePaths.import_modules}/${mod}/${file.split(`/${mod}/`)[1]}`
    );
    const task = new tsk() as BaseTask;
    this._logger.debug(`[Mod ${mod}] Loading Task ${task.name}....`);
    let skip = false;
    this.modules.forEach((module) => {
      if (module.tasks.has(task.name)) {
        this._logger.warn(
          `[(Mod ${mod}) Task ${task.name}] shares the same name as [(Mod ${module.name}) Task ${task.name}]`
        );
        skip = true;
      }
    });

    if (skip) {
      this._logger.error(`[(Mod ${mod}) Task ${task.name}] [SKIPPED]`);
    } else {
      this.modules.get(mod)?.tasks.set(task.name, task);
      this._logger.info(`[(Mod ${mod}) Task ${task.name}] [LOADED]`);
    }
  }
}
