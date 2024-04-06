import { BaseModule } from "../../base/OldBaseModule";

export default class SettingsModule extends BaseModule {
  constructor() {
    super({
      name: "settings",
      description: "Handles the settings",
    });
    this.guardOrder.set("command:leveling_blacklist_channel", [
      "guard:has_manage_guild_perms",
      "command:leveling_blacklist_channel",
    ]);
  }
}
