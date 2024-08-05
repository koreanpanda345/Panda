export default interface BaseEvent {
  info: {
    name: string;
  };
  configurations: {
    eventName: string;
    disabled?: boolean;
	onlyOnce: boolean;
  };

  invoke(...args: any[]): Promise<unknown>;
}

export default abstract class BaseEvent {
  constructor(name: string, eventName: string, onlyOnce: boolean = false, disabled: boolean = false) {
	this.info = {
		name: name,
	};
	this.configurations = {
		onlyOnce: onlyOnce,
		eventName: eventName,
		disabled: disabled,
	};
  }

  public async invoke() {
	throw "Not yet implemented";
  }
}
