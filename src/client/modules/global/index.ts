import { BaseModule } from "../../base/OldBaseModule";

export default class GlobalModule extends BaseModule {
  constructor() {
    super({
      name: "global",
      description: "The default events and commands",
    });
  }
}
