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
			label({ label: 'client'}),
			timestamp(),
			consoleFormat,
		)
	}))
}

// const logger = winston.createLogger({
// 	level: 'debug',
// 	format: winston.format.json(),
// 	defaultMeta: { class: 'client'},
// 	transports: [
// 		new winston.transports.File({ filename: 'logs/error.log', level: 'error'}),
// 		new winston.transports.File({filename: 'logs/combined.log'}),
// 	]
// });

// if (Bun.env.NODE_ENV !== 'production') {
// 	logger.add(new winston.transports.Console({
// 		format: winston.format.simple(),
// 	}));
// }

export default logger;