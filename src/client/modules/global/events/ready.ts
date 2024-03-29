import { Logger } from "../../../../logger";
import { BaseEvent } from "../../../base";

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super({
			name: "ready",
			onlyOnce: true,
		});
	}

	public async invoke() {
		const logger = new Logger('ready event');
		logger.info(`Client is ready!`);
	}
}