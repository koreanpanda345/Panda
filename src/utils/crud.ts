import { GuildConfiguration } from "../models/configurations/GuildConfigurations";
import { ModerationConfiguration } from "../models/configurations/ModerationConfigurations";
import { StarboardConfiguartion } from "../models/configurations/StarboardConfigurations";
import { Starboard } from "../models/Starboard";

export async function getOrCreateConfigurations(discordGuildId: string) {
  let config = await GuildConfiguration.findOne({
    discordGuildId,
  }).populate<ModerationConfiguration>("moderation");

  if (config && config.moderation) return config;

  if (!config) config = await GuildConfiguration.create({ discordGuildId });
  if (config && !(await ModerationConfiguration.findById(config.moderation!)))
    config.moderation = (
      await ModerationConfiguration.create({ enabled: true })
    )._id;
  if (config && !(await StarboardConfiguartion.findById(config.starboard!)))
    config.starboard = (
      await StarboardConfiguartion.create({
        enabled: true,
        starboard: await Starboard.create({
          discordGuildId,
          postings: [],
        }),
      })
    )._id;
  await config.save();
  return config;
}
