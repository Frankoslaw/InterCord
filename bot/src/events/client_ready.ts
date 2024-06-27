import { Events } from "discord.js";
import { Pipeline } from "../utils/pipeline";
import { logger } from "@utils/logger";
import { GenericContext, GenericEvent } from "handlers/generic_handler";
import { DiscordEventTrigger, DiscordEventType } from "handlers/event_discord";


export const event = new GenericEvent(
    {
        discord_trigger: new DiscordEventTrigger (
            Events.ClientReady,
            DiscordEventType.Once
        ),
    },
    Pipeline<GenericContext>(
        (_ctx, next) => {
            logger.info("Bot is online( discord ).");
            next();
        }
    )
)
