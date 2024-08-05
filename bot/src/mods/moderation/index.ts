import BaseModule from "../../base/BaseModule";

export default class ModerationModule extends BaseModule {
	constructor() {
		super('moderation', 'The Moderation module allows you to use any Moderator command and also allows you to set up things such as Moderation Log Channels, Protected/Moderator Roles, and certain options will change how the module works.');
	}
}