import express from "express";
import { config } from "../global";
import { Logger } from "../logger";

const logger = new Logger('webserver/app');
const app = express();

// Express Settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.webserverPort, () => {
	logger.info(`Listening on port ${config.webserverPort}. Can be found on ${config.webserverSSL ? 'https' : 'http'}://${config.webserverHost}${config.webserverHost === 'localhost' ? config.webserverPort : ''}`);
});