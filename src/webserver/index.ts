import express from "express";
import { Config } from "../global";
import { Logger } from "../logger";

const logger = new Logger('webserver');
const app = express();

// Express Settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(Config.webserverPort, () => {
	logger.info(`Listening on port ${Config.webserverPort}. Can be found on ${Config.webserverSSL ? 'https' : 'http'}://${Config.webserverHost}${Config.webserverHost === 'localhost' ? Config.webserverPort : ''}`);
});