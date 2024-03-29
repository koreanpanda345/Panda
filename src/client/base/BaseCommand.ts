import { Collection } from "discord.js";
import { MessageCommandContext } from "../context";

export abstract class BaseCommand {
  private _options: BaseCommandOptions;
  constructor(options: BaseCommandOptions) {
    this._options = options;
  }

  public async invoke(ctx: MessageCommandContext) {
    "Not yet implemented";
  }

  // Getters
  public get name() {
    return this._options.name;
  }
  public get alias() {
    return this._options.alias || [];
  }
  public get description() {
    return this._options.description || "No description was provided";
  }
  public get arguments() {
	return this._options.arguments || new Collection();
  }
}

type BaseCommandOptions = {
  name: string;
  alias?: string[];
  description?: string;
  arguments?: Collection<string, BaseCommandArgumentOptions>;
};

export type BaseCommandArgumentOptions = {
	name: string,
	type: string,
	description?: string,
	default?: string,
	require?: boolean,
}