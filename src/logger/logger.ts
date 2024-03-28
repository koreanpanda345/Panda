import winston from "winston"

export default class Logger {
	private logger: winston.Logger;
	private defaultFormat = winston.format.printf((({ level, message, label, timestamp}) => {
		return `${timestamp} [${label}] [${level}]: ${message}`;
	}));
	constructor(name: string) {
		this.logger = winston.createLogger({
			level: 'debug',
			format: winston.format.combine(
				winston.format.colorize({ all: true }),
				winston.format.label({ label: `${name}`}),
				winston.format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				this.defaultFormat
			),
			transports: [
				new winston.transports.Console()
			],
		})
	}
	public info(message: string) {
		this.logger.info(message)
	}
	public debug(message: string) {
		this.logger.debug(message);
	}
	public warn(message: string) {
		this.logger.warn(message);
	}
	public error(message: string) {
		this.logger.error(message);
	}
}