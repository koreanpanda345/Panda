import { Collection } from "discord.js";
import { loadFiles } from "../utils/fs";
import BaseCommand from "./BaseCommand";
import logger from "../utils/logger";
import BaseEvent from "./BaseEvent";
import BaseMonitor from "./BaseMonitor";
import BaseTask from "./BaseTask";
import type SlashCommandContext from "../context/SlashCommandContext";

export default interface BaseModule {
  info: {
    name: string;
    description?: string;
  };
  configurations: {
    disabled?: boolean;
  };
  files: {
    commands: Collection<string, BaseCommand>;
    events: Collection<string, BaseEvent>;
    monitors: Collection<string, BaseMonitor>;
    tasks: Collection<string, BaseTask>;
  };
}

export default abstract class BaseModule {
  constructor(
    name: string,
    description: string = "No description was provided",
    disabled: boolean = false
  ) {
    // Info
    this.info = {
      name: name,
      description: description,
    };
    this.configurations = {
      disabled: disabled,
    };
    this.files = {
      commands: new Collection(),
      events: new Collection(),
      monitors: new Collection(),
      tasks: new Collection(),
    };
  }

  public async loadRequiredModFiles() {
    // First load the the required files into arrays containing classes
    let commands = await loadFiles<BaseCommand>(this.info.name, "commands");
    let events = await loadFiles<BaseEvent>(this.info.name, "events");
    let monitors = await loadFiles<BaseMonitor>(this.info.name, "monitors");
    let tasks = await loadFiles<BaseTask>(this.info.name, "tasks");

    // Now we will load each array into our collections
    for (let command of commands) {
      this.files.commands.set(command.info.name, command);
      logger.debug(
        `[${this.info.name} mod] [${command.info.name} command] Loaded!`
      );
    }
    for (let event of events) {
      this.files.events.set(event.info.name, event);
      logger.debug(
        `[${this.info.name} mod] [${event.info.name} event] Loaded!`
      );
    }
    for (let monitor of monitors) {
      this.files.monitors.set(monitor.info.name, monitor);
      logger.debug(
        `[${this.info.name} mod] [${monitor.info.name} monitor] Loaded!`
      );
    }
    for (let task of tasks) {
      this.files.tasks.set(task.info.name, task);
      logger.debug(`[${this.info.name} mod] [${task.info.name} task] Loaded!`);
    }
  }

  public getCommand(name: string) {
    return this.files.commands.get(name);
  }

  public async invokeCommand(name: string, ctx: SlashCommandContext) {
    let command = this.files.commands.get(name);

    if (!command) return false;
    let precondition = await command.precondition(ctx);

    if (!precondition)
      return await ctx.interaction.reply({
        embeds: [await command.preconditionError(ctx)],
      });

    await command.invoke(ctx);
  }

  public getMonitor(name: string) {
    return this.files.monitors.get(name);
  }

  public async invokeMonitor(name: string, ...args: any[]) {
    let monitor = this.files.monitors.get(name);

    if (!monitor) return false;

    if (monitor.configurations.disabled) return false;

    await monitor.invoke(...args);
  }

  public getTask(name: string) {
    return this.files.tasks.get(name);
  }

  public async invokeTask(name: string, ...args: any[]) {
    let task = this.files.tasks.get(name);

    if (!task) return false;

    if (task.configurations.disabled) return false;

    await task.invoke(...args);
  }
}
