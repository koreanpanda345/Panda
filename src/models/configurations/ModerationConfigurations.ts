import { model, Schema, type InferSchemaType } from "mongoose";

const moderationConfigurationSchema = new Schema({
  enabled: { type: Boolean },
});

export type ModerationConfiguration = InferSchemaType<typeof moderationConfigurationSchema>;
export const ModerationConfiguration = model("Moderation Configurations", moderationConfigurationSchema);
