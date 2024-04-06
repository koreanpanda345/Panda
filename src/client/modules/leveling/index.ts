import { BaseModule } from "../../base/OldBaseModule";

export default class SettingsModule extends BaseModule {
  constructor() {
    super({
      name: "leveling",
      description: "Handles the leveling module of the bot.",
    });

    this.guardOrder.set("monitor:exp_monitor", [
      "guard:leveling_run_command",
      "guard:blacklist_channel",
      "guard:blacklist_user",
      "monitor:exp_monitor",
    ]);
    this.guardOrder.set("task:levelup", [
      "guard:leveling_run_command",
      "guard:blacklist_channel",
      "guard:blacklist_user",
      "task:levelup",
    ]);
  }
}
