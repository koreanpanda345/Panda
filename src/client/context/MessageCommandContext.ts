import { Collection, Message, MessageCreateOptions, MessagePayload } from "discord.js";
import { BaseCommand } from '../base/BaseCommand';

export default class MessageCommandContext {
	private _message: Message;
	private _args: string[];
	private _command: BaseCommand;
	private _arguments: Collection<string, any>;

	constructor(message: Message, args: string[], command: BaseCommand) {
		this._message = message;
		this._args = args;
		this._command = command;
		this._arguments = new Collection();

		if (command.arguments && command.arguments.size > 0) {
			command.arguments.forEach((x) => {
				if (this._args.length === 0) this._arguments.set(x.name, null);
				if (x.require && this._args.length === 0) this._arguments.set(x.name, null);
				
				if (x.remaining && this._args.length > 0) this._arguments.set(x.name, this._args.join(" "));
				else if (x.remaining && this._args.length === 0) this._arguments.set(x.name, null);
				else if (this._args.length > 0) this._arguments.set(x.name, this._args.shift());

				if (x.default && this._arguments.get(x.name) === null) this._arguments.set(x.name, x.default);

			});
		}
	}

	public async sendMessageToChannel(options: string | MessagePayload | MessageCreateOptions) {
		await this._message.channel.send(options);
	}

	// Getters
	public get msg() { return this._message; }
	public get args() { return this._arguments; }
	public get cmd() { return this._command; }
}