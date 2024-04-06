import { BaseModule } from "../../base/OldBaseModule";

export default class ModerationModule extends BaseModule {
  constructor() {
    super({
      name: "logging",
      description: "Handles the logging system for the bot.",
    });
  }
}
