export default class Config {
	// Workspace Configurations
	public static readonly workspaceState: string = process.env.WORKSPACE_STATE || "PRODUCTION";
	// Discord Configurations
	public static readonly discordClientToken: string = process.env.DISCORD_CLIENT_TOKEN || "NO TOKEN";

	// Database Configurations

	// Webserver Configurations
	public static readonly webserverPort: number = Number(process.env.WEBSERVER_PORT) || 8000;
	public static readonly webserverHost: string = process.env.WEBSERVER_HOST || "localhost";
	public static readonly webserverSSL: boolean = Boolean(process.env.WEBSERVER_SSL) || false;
}