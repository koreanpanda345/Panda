import { Message, MessageCreateOptions, MessagePayload } from "discord.js";

export default class MessageCommandContext {
	private _message: Message;
	private _args: string[];

	constructor(message: Message, args: string[]) {
		this._message = message;
		this._args = args;
	}

	public async sendMessageToChannel(options: string | MessagePayload | MessageCreateOptions) {
		await this._message.channel.send(options);
	}

	// Getters
	public get msg() { return this._message; }
	public get args() { return this._args; }
}