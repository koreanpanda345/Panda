import { BaseCommand } from "../../../base";
import { MessageCommandContext } from "../../../context";

export default class KickCommand extends BaseCommand {
	constructor() {
		super({
			name: 'kick',
			description: 'Kicks a user from the server. Requires: Kick Member permissions!',
		});
	}

	public async invoke(ctx: MessageCommandContext) {
		
	}
}