import { model, Schema, type InferSchemaType } from "mongoose";

const starboardSchema = new Schema({
	discordGuildId: String,
	postings: {
		messages: [String],
		stars: Number,
	}
});

export type Starboard = InferSchemaType<typeof starboardSchema>;
export const Starboard = model("Starboard", starboardSchema);