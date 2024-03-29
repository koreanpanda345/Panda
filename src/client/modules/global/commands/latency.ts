import { BaseCommand } from "../../../base";
import { MessageCommandContext } from "../../../context";

export default class LatencyCommand extends BaseCommand {
	constructor() {
		super({
			name: "latency",
			alias: ["ping"],
		});
	}

	public async invoke(ctx: MessageCommandContext) {
		await ctx.sendMessageToChannel(`Pong!`);
	}
}