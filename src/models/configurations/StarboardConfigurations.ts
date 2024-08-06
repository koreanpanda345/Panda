import { model, Schema, type InferSchemaType } from "mongoose";

const starboardConfigurationSchema = new Schema({
	enabled: Boolean,
	channel: String,
	starboard: { type: Schema.Types.ObjectId, ref: 'Starboards'},
});

export type StarboardConfiguration = InferSchemaType<typeof starboardConfigurationSchema>;
export const StarboardConfiguartion = model("Staboard Configurations", starboardConfigurationSchema);