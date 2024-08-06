import mongoose, { Schema } from "mongoose";

const guildConfigurationSchema = new mongoose.Schema({
  discordGuildId: { type: String, required: true },
  moderation: { type: Schema.Types.ObjectId, ref: "Moderation Configurations" },
  starboard: { type: Schema.Types.ObjectId, ref: "Starboard Configurations" },
});

export type GuildConfiguration = mongoose.InferSchemaType<
  typeof guildConfigurationSchema
>;
export const GuildConfiguration = mongoose.model(
  "Guild Configuration",
  guildConfigurationSchema
);
