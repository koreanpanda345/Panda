import { Schema, model } from "mongoose";

export interface IWallet {
	discord_guild_id: string;
	discord_user_id: string;
	amount: number;
}

const WalletSchema = new Schema<IWallet>({
	discord_guild_id: String,
	discord_user_id: String,
	amount: Number,
});

export default model<IWallet>("wallet", WalletSchema);