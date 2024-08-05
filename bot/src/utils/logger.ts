import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

const consoleFormat = printf(({ level, message, label, timestamp}) => {
	return `[${timestamp}] [${label}] (${level}): ${message}`;
});

const logger = createLogger({
	level: 'debug',
	format: format.json(),
	transports: [
		new transports.File({ filename: 'bot/logs/error.log', level: 'error'}),
		new transports.File({ filename: 'bot/logs/combined.log' }),
	]
});

if (Bun.env.NODE_ENV !== 'production') {
	logger.add(new transports.Console({
		format:combine(
			label({ label: 'bot'}),
			timestamp(),
			consoleFormat,
		)
	}))
}

export default logger;