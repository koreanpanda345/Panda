import BaseEvent from "../../../base/BaseEvent";
import logger from "../../../utils/logger";

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready', 'ready');
	}
	
	async invoke() {
		logger.info(`Client is ready`);
	}
}