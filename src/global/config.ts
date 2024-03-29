export default class Config {
	// Workspace Configurations
	public static readonly workspaceState: string = process.env.WORKSPACE_STATE || "PRODUCTION";
	// Discord Configurations
	public static readonly discordClientToken: string = process.env.DISCORD_CLIENT_TOKEN || "NO TOKEN";
	public static readonly discordClientPrefix: string = process.env.DISCORD_CLIENT_PREFIX || "p!";

	// Database Configurations
	public static readonly databaseURI: string = process.env.MONGODB_CONNECT_URI || "NO DATABASE URL";

	// Webserver Configurations
	public static readonly webserverPort: number = Number(process.env.WEBSERVER_PORT) || 8000;
	public static readonly webserverHost: string = process.env.WEBSERVER_HOST || "localhost";
	public static readonly webserverSSL: boolean = Boolean(process.env.WEBSERVER_SSL) || false;
}