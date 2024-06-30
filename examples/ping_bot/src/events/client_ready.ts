import { Events } from "discord.js";
import {
  Pipeline,
  logger,
  GenericContext,
  GenericEvent,
  DiscordEventTrigger,
  DiscordEventType,
} from "@frankoslaw/intercord";

export const event = new GenericEvent(
  {
    discord_trigger: new DiscordEventTrigger(
      Events.ClientReady,
      DiscordEventType.Once
    ),
  },
  Pipeline<GenericContext>((_ctx, next) => {
    logger.info("Bot is online( discord ).");
    next();
  })
);
